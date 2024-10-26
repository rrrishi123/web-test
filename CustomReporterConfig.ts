import { Reporter, TestCase, TestError, TestResult, TestStep } from "@playwright/test/reporter";
const winston = require(`winston`);

const customFormat = winston.format.printf(({ level, message, timestamp, testId }) => {
    return testId 
        ? `${timestamp} [${level.toUpperCase()}] [Test-${testId}]: ${message}`
        : `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const console = new winston.transports.Console();
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.File({ 
            filename: 'logs/info.log', 
            level: 'info' 
        }),
    ],
});

logger.add(console);

export default class CustomReporterConfig implements Reporter {
    private testCounter = 0;
    private testIdMap = new Map<TestCase, number>();

    onTestBegin(test: TestCase): void {
        this.testCounter++;
        this.testIdMap.set(test, this.testCounter);
        
        const testId = this.testIdMap.get(test);
        logger.info('\n' + '='.repeat(100), { testId });
        logger.info(`🎯 Test Started: ${test.title}`, { testId });
        logger.info('='.repeat(100), { testId });
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const testId = this.testIdMap.get(test);
        const status = result.status === 'passed' ? '✅' : '❌';
        
        logger.info('\n' + '-'.repeat(50), { testId });
        logger.info(`${status} Test Completed: ${test.title} - Status: ${result.status}`, { testId });
        
        if (result.error) {
            logger.error('\nDetailed Error Information:', { testId });
            
            // Split error message to get detailed information
            const errorLines = result.error.message.split('\n');
            errorLines.forEach(line => {
                // Log each line of the error message
                logger.error(line, { testId });
            });

            // Log stack trace if available
            if (result.error.stack) {
                logger.error('\nStack Trace:', { testId });
                const stackLines = result.error.stack.split('\n');
                stackLines.forEach(line => {
                    logger.error(line, { testId });
                });
            }
        }
        logger.info('-'.repeat(50) + '\n', { testId });
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === `test.step`) {
            const testId = this.testIdMap.get(test);
            logger.info(`▶️ Starting Step: ${step.title}`, { testId });
        }
    }

    onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === `test.step`) {
            const testId = this.testIdMap.get(test);
            logger.info(`✔️ Completed Step: ${step.title}`, { testId });
            
            if (step.error) {
                logger.error(`\nStep Error in "${step.title}":`, { testId });
                logger.error(step.error.message, { testId });
            }
        }
    }

    onError(error: TestError): void {
        logger.error('\n❌ Error Details:');
        logger.error(`Message: ${error.message}`);
        
        if (error.stack) {
            logger.error('\nStack Trace:');
            const stackLines = error.stack.split('\n');
            stackLines.forEach(line => {
                logger.error(line);
            });
        }
    
        if (error.value) {
            logger.error('\nAdditional Context:');
            logger.error(error.value);
        }
    }
}