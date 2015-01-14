

WinJS.log = function (message, tag, type) {
    var isError = (type === "error");
    var isStatus = (type === "status");

    if (isError || isStatus) {
        var statusDiv = /* @type(HTMLElement) */ document.getElementById("statusMessage");
        if (statusDiv) {
            statusDiv.innerText = message;
            if (isError) {
                lastError = message;
                statusDiv.style.color = "blue";
            } else if (isStatus) {
                lastStatus = message;

                statusDiv.style.color = "green";
            }
        }
    }
};