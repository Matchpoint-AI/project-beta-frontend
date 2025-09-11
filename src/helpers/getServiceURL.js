var baseurl = window.location.hostname === 'www.matchpointai.com'
    ? 'matchpointai.com'
    : window.location.hostname;
export var getServiceURL = function (service) {
    var url = '';
    if (baseurl === 'localhost' || baseurl === '127.0.0.1') {
        switch (service) {
            case 'data':
                url = "https://localhost:7651";
                break;
            case 'llm':
                url = "https://localhost:7652";
                break;
            case 'content-gen':
                url = "https://localhost:7653";
                break;
            case 'campaign-manager':
                url = "https://localhost:7654";
                break;
        }
    }
    else {
        switch (service) {
            case 'data':
                url = "https://data.".concat(baseurl);
                break;
            case 'llm':
                url = "https://llm.".concat(baseurl);
                break;
            case 'content-gen':
                url = "https://content-gen.".concat(baseurl);
                break;
            case 'campaign-manager':
                url = "https://campaign-manager.".concat(baseurl);
                break;
        }
    }
    return url;
};
// export const getServiceURL = (service: Service) => {
//    let url = "";
//    if (env === "local") {
//       switch (service) {
//          case "data":
//             url = `http://localhost:7651`;
//             break;
//          case "llm":
//             url = `http://localhost:7652`;
//             break;
//          case "content-gen":
//             url = `http://localhost:7653`;
//             break;
//          case "campaign-manager":
//             url = `http://localhost:7654`;
//             break;
//       }
//    } else {
//       switch (service) {
//          case "data":
//             url = `https://data-${env}-228605374820.us-central1.run.app`;
//             break;
//          case "llm":
//             url = `https://llm-${env}-228605374820.us-central1.run.app`;
//             break;
//          case "content-gen":
//             url = `https://content-gen-${env}-228605374820.us-central1.run.app`;
//             break;
//          case "campaign-manager":
//             url = `https://campaign-manager-${env}-228605374820.us-central1.run.app`;
//             break;
//       }
//    }
//    return url;
// };
//# sourceMappingURL=getServiceURL.js.map