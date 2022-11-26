import { EvaluationImage } from './../entities/evaluationImage';
import { LocalFile } from './../entities/localFile';
import { OrderProduct } from './../entities/orderProduct';
import { Product } from './../entities/product';
import { ShopPDataSource } from './../data';
import { Evaluation } from './../entities/evaluation';
import { HttpStatusCode } from '../utils/shopp.enum';
import Response from '../utils/response';
import { User } from '../entities/user';
import { ModelService } from '../utils/decorators';
export default class EvaluationModel {
  static async showAllEvaluationsOfProduct(productId: string) {
    const productRepository = ShopPDataSource.getRepository(Product);
    const evaluationRepository = ShopPDataSource.getRepository(Evaluation);
    const product = await productRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (!product)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Product not exist!');
    const evaluations = await evaluationRepository.find({
      relations: {
        evaluationImage: true
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
    const evaluation = evaluationRepository.findOne({
      where: {
        id: evaluationId,
      },
    });
    if (!evaluation)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Evaluation id not exist!'
      );
    return new Response(
      HttpStatusCode.OK,
      'Get evaluation successfully!',
      evaluation
    );
  }

  @ModelService()
  static async postNewEvaluation(
    orderProductId: string,
    feedback: string,
    star: number,
    localFiles: LocalFile[],
    user: User
  ) {
    const evaluationRepository = ShopPDataSource.getRepository(Evaluation);
    const orderProductRepository = ShopPDataSource.getRepository(OrderProduct);
    const evaluationImageRepository = ShopPDataSource.getRepository(EvaluationImage)
    const orderProduct = await orderProductRepository.findOne({
      relations: {
        orderNumber: true,
        evaluation: true,
      },
      where: {
        id: orderProductId,
      },
    });
    if (!orderProduct)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Order product not exist!'
      );
    if (orderProduct.orderNumber.customer.id != user.customer.id)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'This order product is not yours!'
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
    if(localFiles.length !=0) {
      localFiles.forEach(localFile => {
        evaluationImageRepository.save({
          localFile,
          evaluation,
        })
      })
    }
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
    user: User
  ) {
    const evaluationRepository = ShopPDataSource.getRepository(Evaluation);
    const evaluation = evaluationRepository.findOne({
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
    const result = await evaluationRepository.update(evaluationId, {
      star,
      feedback,
    });
    if (result.affected == 0)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Edit evaluation failed!'
      );
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
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Evaluation id not exist!'
      );
    return new Response(HttpStatusCode.OK, 'Delete evaluation successfully!');
  }
}
