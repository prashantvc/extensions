#pragma warning disable CS8618
#pragma warning disable CS8603


using System.Text.Json;
using System.Text.Json.Serialization;

public partial class Extension
{

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("displayName")]
    public string DisplayName { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("icon")]
    public string Icon { get; set; }

    [JsonPropertyName("version")]
    public string Version { get; set; }

    [JsonPropertyName("preview")]
    public bool Preview { get; set; }

    [JsonPropertyName("publisher")]
    public string Publisher { get; set; }

    private Dictionary<string, object> _author;

    [JsonPropertyName("author")]
    public object Author 
    {
        get { return _author != null ? (object)_author : (object)AuthorName; }
        set 
        {
            switch (value)
            {
                case Dictionary<string, object> author:
                    _author = author;
                    break;
                case JsonElement authorName:
                    AuthorName = authorName.ToString();
                    break;
                case string an:
                    AuthorName = an;
                    break;
                default:
                    throw new ArgumentException("Author must be an Author object or a string.");
            }
        }
    }

    [JsonIgnore]
    public string AuthorName { get; set; }

    [JsonPropertyName("galleryBanner")]
    public GalleryBanner GalleryBanner { get; set; }

    [JsonPropertyName("qna")]
    public Uri Qna { get; set; }

    [JsonPropertyName("license")]
    public string License { get; set; }

    [JsonPropertyName("homepage")]
    public Uri Homepage { get; set; }

    [JsonPropertyName("repository")]
    public Repository Repository { get; set; }

    [JsonPropertyName("bugs")]
    public Bugs Bugs { get; set; }

    [JsonPropertyName("engines")]
    public Engines Engines { get; set; }

    [JsonPropertyName("categories")]
    public string[] Categories { get; set; }

    [JsonPropertyName("keywords")]
    public string[] Keywords { get; set; }

    /// <summary>
    /// Extension Identifier - {Publisher}.{Name}
    /// </summary>
    public string Identifier => $"{Publisher}.{Name}";

    public bool IsPreRelease { get; set; }
}

public partial class Author
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("email")]
    public string Email { get; set; }

    public override string ToString()
    {
        return Name;
    }
}

public partial class Bugs
{
    [JsonPropertyName("url")]
    public Uri Url { get; set; }
}

public partial class Engines
{
    [JsonPropertyName("vscode")]
    public string VSCodeEngine { get; set; }
}

public partial class GalleryBanner
{
    [JsonPropertyName("theme")]
    public string Theme { get; set; }

    [JsonPropertyName("color")]
    public string Color { get; set; }
}

public partial class Repository
{
    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("url")]
    public Uri Url { get; set; }
}

public partial class Extension
{
    public static Extension FromJson(string json) => JsonSerializer.Deserialize<Extension>(json, Converter.Settings);
}

public static class Serialize
{
    public static string ToJson(this Extension self) => JsonSerializer.Serialize(self, Converter.Settings);
}

internal static class Converter
{
    public static readonly JsonSerializerOptions Settings = new(JsonSerializerDefaults.General)
    {
        Converters =
        {

        },
    };
}

#pragma warning restore CS8618
#pragma warning restore CS8603
