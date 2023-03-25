using LiteDB;

namespace extensions_web_tests;

public class ExtensionControllerTests
{
    [SetUp]
    public void Setup()
    {
        _environment = new Mock<IWebHostEnvironment>();
        _logger = new Mock<ILogger<ExtensionController>>();
        _databaseService = new Mock<IDatabaseService>();
        _manifestReader = new Mock<IPackageReader>();

        _controller = new ExtensionController(
            _databaseService.Object,
            _logger.Object,
            _environment.Object,
            _manifestReader.Object);
    }

    [Test]
    public void GetExtensionsTest()
    {
        _databaseService.Setup(x => x.Packages).Returns(default(ILiteCollection<PackageManifest>));
        _databaseService.Setup(x => x.Packages).Returns(default(ILiteCollection<PackageManifest>));
        var result = _controller.GetExtensions();

        Assert.NotNull(result);

    }

    ExtensionController _controller;
    Mock<IDatabaseService> _databaseService;
    Mock<IPackageReader> _manifestReader;
    Mock<ILogger<ExtensionController>> _logger;
    Mock<IWebHostEnvironment> _environment;
}