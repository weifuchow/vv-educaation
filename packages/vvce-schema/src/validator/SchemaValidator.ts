/**
 * SchemaValidator - Ajv-based JSON Schema validation
 * Provides strict structural validation using JSON Schema
 */

import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import type { CourseDSL } from '../types/dsl';
import courseSchema from '../../schemas/course.schema.json';

export interface SchemaValidationError {
  path: string;
  message: string;
  keyword: string;
  params?: Record<string, unknown>;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: SchemaValidationError[];
}

/**
 * SchemaValidator uses Ajv for JSON Schema validation
 */
export class SchemaValidator {
  private ajv: Ajv;
  private validate: ReturnType<Ajv['compile']>;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false,
    });

    // Add format validation (date-time, uri, etc.)
    addFormats(this.ajv);

    // Compile the schema
    this.validate = this.ajv.compile(courseSchema);
  }

  /**
   * Validate a course DSL against the JSON Schema
   */
  validateSchema(dsl: unknown): SchemaValidationResult {
    const valid = this.validate(dsl);

    if (valid) {
      return { valid: true, errors: [] };
    }

    const errors = this.formatErrors(this.validate.errors || []);
    return { valid: false, errors };
  }

  /**
   * Format Ajv errors into user-friendly messages
   */
  private formatErrors(ajvErrors: ErrorObject[]): SchemaValidationError[] {
    return ajvErrors.map((error) => {
      const path = error.instancePath || '/';
      const message = this.getErrorMessage(error);

      return {
        path: path.replace(/\//g, '.').replace(/^\./, ''),
        message,
        keyword: error.keyword,
        params: error.params as Record<string, unknown>,
      };
    });
  }

  /**
   * Get user-friendly error message based on error type
   */
  private getErrorMessage(error: ErrorObject): string {
    const { keyword, params, message } = error;

    switch (keyword) {
      case 'required':
        return `缺少必需字段: ${(params as { missingProperty: string }).missingProperty}`;
      case 'type':
        return `类型错误: 期望 ${(params as { type: string }).type}`;
      case 'enum':
        return `值必须是以下之一: ${(params as { allowedValues: unknown[] }).allowedValues.join(', ')}`;
      case 'const':
        return `值必须为: ${(params as { allowedValue: unknown }).allowedValue}`;
      case 'minLength':
        return `字符串长度必须至少为 ${(params as { limit: number }).limit}`;
      case 'minItems':
        return `数组长度必须至少为 ${(params as { limit: number }).limit}`;
      case 'minimum':
        return `值必须 >= ${(params as { limit: number }).limit}`;
      case 'maximum':
        return `值必须 <= ${(params as { limit: number }).limit}`;
      case 'pattern':
        return `格式不匹配: ${message}`;
      case 'additionalProperties':
        return `不允许的额外属性: ${(params as { additionalProperty: string }).additionalProperty}`;
      case 'oneOf':
        return `必须匹配其中一个模式`;
      default:
        return message || `校验失败: ${keyword}`;
    }
  }

  /**
   * Quick check if DSL is valid (without detailed errors)
   */
  isValid(dsl: unknown): dsl is CourseDSL {
    return this.validate(dsl) === true;
  }
}

/**
 * Convenience function for schema validation
 */
export function validateSchema(dsl: unknown): SchemaValidationResult {
  const validator = new SchemaValidator();
  return validator.validateSchema(dsl);
}
