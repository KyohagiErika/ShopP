import { ReasonEvaluationReportEnum, RoleEnum } from './../utils/shopp.enum';
import { EvaluationReport } from './../entities/evaluationReport';
import { ShopPDataSource } from '../data';
import { Evaluation } from '../entities/evaluation';
import { HttpStatusCode, StatusReportEnum } from '../utils/shopp.enum';
import Response from '../utils/response';
import { User } from '../entities/user';
import { Like } from 'typeorm';

const evaluationRepository = ShopPDataSource.getRepository(Evaluation);
const evaluationReportRepository =
  ShopPDataSource.getRepository(EvaluationReport);
export default class EvaluationReportModel {
  static async getAllEvaluationsReports() {
    const evaluationReports = await evaluationReportRepository.find({
      relations: {
        reporter: true,
      },
      order: {
        reportedAt: 'DESC',
      },
      where: {
        status: StatusReportEnum.PROCESSING,
      },
    });
    if (evaluationReports.length == 0)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unavailable evaluation reports!'
      );
    return new Response(
      HttpStatusCode.OK,
      'Get evaluation reports successfully!',
      evaluationReports
    );
  }

  static async getEvaluationsReportsByEvaluationId(evaluationId: number) {
    const evaluationReports = await evaluationReportRepository.find({
      relations: {
        evaluation: true,
        reporter: true,
      },
      order: {
        reportedAt: 'DESC',
      },
      where: {
        status: StatusReportEnum.PROCESSING,
        evaluation: { id: evaluationId },
      },
    });
    if (evaluationReports.length == 0)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unavailable evaluation reports!'
      );
    return new Response(
      HttpStatusCode.OK,
      'Get evaluation reports successfully!',
      evaluationReports
    );
  }

  static async getEvaluationsReportsofReporter(user: User) {
    let roleReporter =
      user.role.role == RoleEnum.CUSTOMER
        ? 0
        : user.role.role == RoleEnum.ADMIN
        ? 2
        : 1;
    const evaluationReports = await evaluationReportRepository.find({
      where: {
        reporter: { id: user.id },
        roleReporter: Like(roleReporter),
      },
      relations: {
        evaluation: true,
      },
      order: {
        reportedAt: 'DESC',
      },
    });
    if (evaluationReports.length == 0)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unavailable evaluation reports!'
      );
    return new Response(
      HttpStatusCode.OK,
      'Get evaluation reports successfully!',
      evaluationReports
    );
  }

  static async getEvaluationsReportById(
    evaluationReportId: number,
    user: User
  ) {
    let roleReporter =
      user.role.role == RoleEnum.CUSTOMER
        ? 0
        : user.role.role == RoleEnum.ADMIN
        ? 2
        : 1;
    let evaluationReport;
    if (user.role.role == RoleEnum.ADMIN) {
      evaluationReport = await evaluationReportRepository.findOne({
        where: {
          id: evaluationReportId,
        },
        relations: {
          evaluation: true,
          reporter: true,
        },
      });
    } else {
      evaluationReport = await evaluationReportRepository.findOne({
        where: {
          id: evaluationReportId,
          reporter: { id: user.id },
          roleReporter: roleReporter,
        },
        relations: {
          evaluation: true,
          reporter: true,
        },
      });
    }
    if (!evaluationReport)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Unavailable evaluation report!'
      );
    return new Response(
      HttpStatusCode.OK,
      'Get evaluation report successfully!',
      evaluationReport
    );
  }

  static async newEvaluationReport(
    evaluationId: number,
    reason: ReasonEvaluationReportEnum,
    description: string,
    reporter: User
  ) {
    const evaluation = await evaluationRepository.findOne({
      where: {
        id: evaluationId,
      },
    });
    if (!evaluation)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Evaluation not found!');
    const evaluationReport = await evaluationReportRepository.findOne({
      where: {
        reporter: { id: reporter.id },
        evaluation: { id: evaluationId },
      },
    });
    if (evaluationReport)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Already reported!');
    const result = await evaluationReportRepository.save({
      reason,
      description,
      roleReporter: reporter.role.role,
      reporter,
      evaluation,
    });
    return new Response(
      HttpStatusCode.OK,
      'Create new evaluation report successfully!',
      result
    );
  }

  static async editEvaluationReport(
    evaluationReportId: number,
    reason: ReasonEvaluationReportEnum,
    description: string,
    reporter: User
  ) {
    let roleReporter =
      reporter.role.role == RoleEnum.CUSTOMER
        ? 0
        : reporter.role.role == RoleEnum.ADMIN
        ? 2
        : 1;
    const evaluationReport = await evaluationReportRepository.findOne({
      where: {
        id: evaluationReportId,
        reporter: { id: reporter.id },
        roleReporter: Like(roleReporter),
      },
    });
    if (!evaluationReport)
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Evaluation Report not found!'
      );
    const result = await evaluationReportRepository.update(
      { id: evaluationReport.id },
      {
        reason,
        description,
      }
    );
    if (result.affected != 0)
      return new Response(
        HttpStatusCode.OK,
        'Update evaluation report successfully!'
      );
    return new Response(
      HttpStatusCode.BAD_REQUEST,
      'Update evaluation report failed!'
    );
  }
}
