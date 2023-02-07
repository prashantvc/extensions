using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;



[Route("api/[controller]")]
[ApiController]
public class ExtensionController : ControllerBase
{
    public List<Extension> GetExtensions()
    {
        var exts = _databaseService.Extensions
                    .Query()
                    .ToList();

        return exts;
    }

    public ExtensionController([NotNull] IDatabaseService databaseService)
    {
        _databaseService = databaseService;
    }
    readonly IDatabaseService _databaseService;
}
