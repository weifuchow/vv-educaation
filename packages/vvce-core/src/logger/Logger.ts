/**
 * Logger - 日志记录器
 * 记录运行时事件、条件、动作、状态变更等信息
 * 用于调试和回放
 */

import type { LogEntry, LogLevel } from '../types';

export class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number;
  private debugMode: boolean;

  constructor(options: { maxLogs?: number; debug?: boolean } = {}) {
    this.maxLogs = options.maxLogs ?? 1000;
    this.debugMode = options.debug ?? false;
  }

  /**
   * 记录日志
   */
  log(level: LogLevel, type: LogEntry['type'], message: string, data?: any): void {
    const entry: LogEntry = {
      level,
      type,
      message,
      data,
      ts: Date.now(),
    };

    this.logs.push(entry);

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 调试模式下输出到控制台
    if (this.debugMode) {
      this.printToConsole(entry);
    }
  }

  debug(type: LogEntry['type'], message: string, data?: any): void {
    this.log('debug', type, message, data);
  }

  info(type: LogEntry['type'], message: string, data?: any): void {
    this.log('info', type, message, data);
  }

  warn(type: LogEntry['type'], message: string, data?: any): void {
    this.log('warn', type, message, data);
  }

  error(type: LogEntry['type'], message: string, data?: any): void {
    this.log('error', type, message, data);
  }

  /**
   * 获取所有日志
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * 获取最近 N 条日志
   */
  getRecentLogs(count: number): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * 按类型过滤日志
   */
  getLogsByType(type: LogEntry['type']): LogEntry[] {
    return this.logs.filter((log) => log.type === type);
  }

  /**
   * 按级别过滤日志
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * 清空日志
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * 输出到控制台
   */
  private printToConsole(entry: LogEntry): void {
    const prefix = `[VVCE ${entry.type.toUpperCase()}]`;
    const timestamp = new Date(entry.ts).toISOString();

    switch (entry.level) {
      case 'debug':
        console.debug(prefix, timestamp, entry.message, entry.data);
        break;
      case 'info':
        console.info(prefix, timestamp, entry.message, entry.data);
        break;
      case 'warn':
        console.warn(prefix, timestamp, entry.message, entry.data);
        break;
      case 'error':
        console.error(prefix, timestamp, entry.message, entry.data);
        break;
    }
  }

  /**
   * 导出日志（用于分析或上报）
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 导入日志（用于回放）
   */
  import(logsJson: string): void {
    try {
      this.logs = JSON.parse(logsJson);
    } catch (error) {
      console.error('Failed to import logs:', error);
    }
  }
}
