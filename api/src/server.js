require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

// Test database connection and start server
const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Sync database (in development only)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: false });
            console.log('✅ Database synchronized.');
        }

        // Start server
        const server = app.listen(PORT, () => {
            console.log(`🚀 SmartRetail API server running on port ${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
            console.log(`🌐 API Portal: http://localhost:${PORT}`);
            console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`);
            console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(async () => {
                console.log('HTTP server closed');
                await sequelize.close();
                console.log('Database connection closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT signal received: closing HTTP server');
            server.close(async () => {
                console.log('HTTP server closed');
                await sequelize.close();
                console.log('Database connection closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
};

startServer();
