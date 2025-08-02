# 🛩️ OpenA3XX Flight Deck

A modern, enterprise-ready Angular 17 application for configuring and managing OpenA3XX hardware panels, simulator events, and real-time monitoring.


## 🤝 Support the Project

If you find this project helpful and would like to support its development, consider sponsoring us:

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor%20on%20GitHub-red?style=for-the-badge&logo=github)](https://github.com/sponsors/OpenA3XX)

Or support us through other platforms:
- [Buy Me a Coffee](https://www.buymeacoffee.com/opena3xx)
- [Patreon](https://www.patreon.com/opena3xx)

Your support helps us maintain and improve this project! ❤️



## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Documentation](#documentation)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

- **Hardware Management**: Configure and manage OpenA3XX hardware panels
- **Real-time Monitoring**: Monitor system status and hardware connections
- **Event Management**: Manage simulator events and configurations
- **Modern UI**: Built with Angular Material and responsive design
- **Dark/Light Theme**: Support for both light and dark themes
- **Real-time Updates**: WebSocket integration for live data updates
- **Comprehensive Testing**: Unit tests, integration tests, and e2e tests
- **Documentation**: Auto-generated API documentation with Compodoc

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Angular CLI** (v17 or higher)
- **Git**

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/opena3xx-flight-deck.git
   cd opena3xx-flight-deck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:4200`

## 🔧 Development

### Environment Configuration

The application uses environment-specific configuration files located in `src/assets/config/`:

- `app-config.json` - Default configuration
- `app-config.development.json` - Development environment
- `app-config.production.json` - Production environment

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run e2e` - Run end-to-end tests
- `npm run lint` - Run linting
- `npm run docs` - Generate documentation

## 🏗️ Building

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build:prod
```

### Docker Build
```bash
npm run build:docker
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run e2e
```

### Test Coverage
```bash
npm run test:ci
```

## 📚 Documentation

### Generate Documentation
```bash
npm run docs
```

### Serve Documentation
```bash
npm run docs:serve
```

## 🐳 Docker

### Build Docker Image
```bash
docker build -t opena3xx-flight-deck .
```

### Run Docker Container
```bash
docker run -p 80:80 opena3xx-flight-deck
```

### Run with Custom Configuration
```bash
docker run -p 80:80 -v $(pwd)/config:/usr/share/nginx/html/assets/config opena3xx-flight-deck
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](Contributing.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run linting before committing (`npm run lint`)
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](documentation/)
2. Search existing [issues](https://github.com/your-username/opena3xx-flight-deck/issues)
3. Create a new issue with detailed information

## 🔗 Related Projects

- [OpenA3XX Backend](https://github.com/your-username/opena3xx-backend)
- [OpenA3XX Hardware](https://github.com/your-username/opena3xx-hardware)

---

**Note**: This is a development version. For production use, please ensure all security measures are properly configured.
