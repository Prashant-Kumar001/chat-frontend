const renderAttachment = (file, url, description = "") => {
    switch (file) {
        case "video":
            return <video src={url} controls />;
        case "image":
            return (
                <img
                    src={url}
                    alt={description}
                    className="w-[200px] h-[150px] object-contain "
                />
            );
        case "audio":
            return <audio src={url} controls className="w-[200px] h-[150px] object-contain" />;
        default:
            return <a href={url}>Download</a>;
    }

}
export default renderAttachment;