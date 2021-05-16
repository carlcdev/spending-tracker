import { APIGatewayProxyResult } from 'aws-lambda';
import { CustomError } from '../';
export declare function apiGatewayErrorTransformer(error: CustomError): APIGatewayProxyResult;
