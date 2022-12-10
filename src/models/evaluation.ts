import { EvaluationImage } from './../entities/evaluationImage';
import { LocalFile } from './../entities/localFile';
import { OrderProduct } from './../entities/orderProduct';
import { Product } from './../entities/product';
import { ShopPDataSource } from './../data';
import { Evaluation } from './../entities/evaluation';
import { HttpStatusCode, RoleEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { User } from '../entities/user';
import { Customer } from '../entities/customer';
import { ModelService } from '../utils/decorators';
import { EntityManager } from 'typeorm';

export default class EvaluationModel {
  static async showAllEvaluationsOfProduct(productId: string) {
    const productRepository = ShopPDataSource.getRepository(Product);
    const evaluationRepository = ShopPDataSource.getRepository(Evaluation);
    const product = await productRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (product == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Product not exist!');
    const evaluations = await evaluationRepository.find({
      relations: {
        evaluationImages: {
          localFile: true,
        },
      },
      where: {
        orderProduct: { product: { id: productId } },
      },
    });
    if (evaluations.length == 0)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'No evaluations available!'
      );
    return new Response(
      HttpStatusCode.OK,
      'Show evaluations successfully!',
      evaluations
    );
  }

  static async getEvaluationById(evaluationId: number) {
    const evaluationRepository = ShopPDataSource.getRepository(Evaluation);
    const evaluation = await evaluationRepository.findOne({
      relations: {
        evaluationImages: {
          localFile: true,
        },
      },
      where: {
        id: evaluationId,
      },
    });
    if (evaluation == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Evaluation not exist!');
    return new Response(
      HttpStatusCode.OK,
      'Get evaluation successfully!',
      evaluation
    );
  }

  @ModelService()
  static async postNewEvaluation(
    transactionalEntityManager: EntityManager,
    orderProductId: string,
    feedback: string,
    star: number,
    localFiles: LocalFile[],
    user: User
  ): Promise<Response> {
    const evaluationRepository =
      transactionalEntityManager.getRepository(Evaluation);
    const orderProductRepository =
      transactionalEntityManager.getRepository(OrderProduct);
    const evaluationImageRepository =
      transactionalEntityManager.getRepository(EvaluationImage);
    const orderProduct = await orderProductRepository.findOne({
      relations: {
        orderNumber: true,
        evaluation: true,
      },
      where: {
        id: orderProductId,
        orderNumber: { customer: { id: user.customer.id } },
      },
    });
    if (orderProduct == null)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Order product not exist!'
      );
    if (orderProduct.evaluation)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Evaluation is already existed on this order product!'
      );

    const evaluation = await evaluationRepository.save({
      star,
      feedback,
      orderProduct,
    });

    var evaluationImages = new Array<EvaluationImage>();
    var evaluationImage;
    localFiles.forEach(localFile => {
      evaluationImage = new EvaluationImage();
      evaluationImage.localFile = localFile;
      evaluationImage.evaluation = evaluation;
      evaluationImages.push(evaluationImage);
    });

    await evaluationImageRepository.save(evaluationImages);

    return new Response(
      HttpStatusCode.OK,
      'Post new evaluation successfully!',
      evaluation
    );
  }

  static async editEvaluation(
    evaluationId: number,
    feedback: string,
    star: number,
    localFiles: LocalFile[],
    user: User
  ) {
    const evaluationRepository = ShopPDataSource.getRepository(Evaluation);
    const evaluationImageRepository =
      ShopPDataSource.getRepository(EvaluationImage);
    const evaluation = await evaluationRepository.findOne({
      where: {
        id: evaluationId,
        orderProduct: { orderNumber: { customer: { id: user.customer.id } } },
      },
    });
    if (!evaluation)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Evaluation id not exist!'
      );
    evaluation.evaluationImages = [];
    evaluation.star = star;
    evaluation.feedback = feedback;
    if (localFiles.length != 0) {
      for (let i = 0; i < localFiles.length; i++) {
        let evaluationImage: EvaluationImage =
          await evaluationImageRepository.save({
            localFile: localFiles[i],
          });
        evaluation.evaluationImages.push(evaluationImage);
      }
    }
    const result = await evaluationRepository.save(evaluation);
    return new Response(
      HttpStatusCode.OK,
      'Edit evaluation successfully!',
      result
    );
  }

  static async deleteEvaluation(evaluationId: number, user: User) {
    const evaluationRepository = ShopPDataSource.getRepository(Evaluation);
    const result = await evaluationRepository.delete({
      id: evaluationId,
      orderProduct: { orderNumber: { customer: { id: user.customer.id } } },
    });
    if (result.affected == 0)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Evaluation not exist!');
    return new Response(HttpStatusCode.OK, 'Delete evaluation successfully!');
  }

  static async alterLikesOfEvaluation(evaluationId: number, user: User) {
    const evaluationRepository = ShopPDataSource.getRepository(Evaluation);
    if (user.role.role == RoleEnum.ADMIN)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unauthorized role. Admin can not access!'
      );
    const evaluation = await evaluationRepository.findOne({
      relations: {
        likedPeople: true,
      },
      where: {
        id: evaluationId,
      },
    });
    if (evaluation == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Evaluation not exist!');
    const likedPeople: Customer[] = evaluation.likedPeople;
    const lengthOfLikedPeopleBefore = likedPeople.length;
    evaluation.likedPeople.filter(customer => {
      return customer.id != user.customer.id;
    });
    if (evaluation.likedPeople.length != lengthOfLikedPeopleBefore) {
      evaluation.likes--;
      await evaluationRepository.save(evaluation);
      return new Response(HttpStatusCode.OK, 'Reduce likes successfully!', {
        likes: evaluation.likes,
      });
    } else {
      evaluation.likedPeople.push(user.customer);
      evaluation.likes++;
      await evaluationRepository.save(evaluation);
      return new Response(HttpStatusCode.OK, 'Increase likes successfully!', {
        likes: evaluation.likes,
      });
    }
  }
}
