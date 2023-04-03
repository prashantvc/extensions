using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;

namespace MyProject.Tests
{
    [TestFixture]
    public class ExtensionControllerTests
    {
        private ExtensionController _controller;
        private Mock<IDatabaseService> _databaseService;
        private Mock<IWebHostEnvironment> _webHostEnvironment;
        private Mock<IPackageReader> _manifestReader;

        [SetUp]
        public void Setup()
        {
            _databaseService = new Mock<IDatabaseService>();
            _webHostEnvironment = new Mock<IWebHostEnvironment>();
            _manifestReader = new Mock<IPackageReader>();
            _controller = new ExtensionController(_databaseService.Object, _webHostEnvironment.Object, _manifestReader.Object);
        }

        [Test]
        public void GetExtensions_ReturnsOkResult_WhenPackagesExist()
        {

            // Arrange
            _databaseService.Setup(x => x.Find(It.IsAny<System.Linq.Expressions.Expression<Func<ExtensionManifest, bool>>>()))
                .Returns(new List<ExtensionManifest>
                {
                    new ExtensionManifest
                    {
                        Metadata = new Metadata
                        {
                            Identity = new Identity
                            {
                                Id = "test",
                                Version = "1.0.0",
                                Publisher = "test"
                            }
                        }
                    }
                });


            // Act
            var result = _controller.GetExtensions(false);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = (OkObjectResult)result;
            var packagesList = (IEnumerable<ExtensionPackage>)okResult.Value;

            Assert.That(packagesList.Count(), Is.EqualTo(1));
            var package = packagesList.First();
            Assert.That(package.Identifier, Is.EqualTo("test.test"));
        }

    }
}