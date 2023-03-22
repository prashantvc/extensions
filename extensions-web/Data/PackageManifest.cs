using System.Xml.Serialization;

[XmlRoot("PackageManifest", Namespace = "http://schemas.microsoft.com/developer/vsx-schema/2011")]
public class PackageManifest
{
    [XmlElement("Metadata")]
    public Metadata? Metadata { get; set; }
    [XmlArray("Assets")]
    [XmlArrayItem("Asset")]
    public List<Asset> Assets { get; set; }
    public string Identifier => $"{Metadata!.Identity!.Publisher}.{Metadata.Identity.Id}";
    public bool IsPreRelease { get; set; }

    public string Version => Metadata.Identity.Version;
}

public class Metadata
{
    [XmlElement("Identity")]
    public Identity? Identity { get; set; }

    [XmlElement("DisplayName")]
    public string? DisplayName { get; set; }

    [XmlElement("Categories")]
    public string? CategoryString { get; set; }

    [XmlElement("Description")]
    public string? Description { get; set; }

    public string[] Categories => CategoryString?.Split(',');
}

public class Identity
{
    [XmlAttribute("Language")]
    public string? Language { get; set; }

    [XmlAttribute("Id")]
    public string? Id { get; set; }

    [XmlAttribute("Version")]
    public string? Version { get; set; }

    [XmlAttribute("Publisher")]
    public string? Publisher { get; set; }

    [XmlAttribute("TargetPlatform")]
    public string? TargetPlatform { get; set; }
}

public class Asset
{
    [XmlAttribute("Type")]
    public string? AssetType { get; set; }

    [XmlAttribute("Path")]
    public string? Path { get; set; }
}