var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
import { getServiceURL } from './getServiceURL';
// /api/v1/fetchContent
export var fetchWebsiteData = function (url, setProgressDescription) {
  return __awaiter(void 0, void 0, void 0, function () {
    var llm_url, response, data, get_locations, extract_location, locations;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          llm_url = getServiceURL('llm');
          return [
            4 /*yield*/,
            fetch(''.concat(llm_url, '/api/v1/llm/fetch-content'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url: url }),
            }),
          ];
        case 1:
          response = _a.sent();
          return [4 /*yield*/, response.json()];
        case 2:
          data = _a.sent();
          setProgressDescription('Extracting Physical Locations...');
          return [
            4 /*yield*/,
            fetch(''.concat(llm_url, '/api/v1/llm/physical-locations'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                prompt:
                  '\n                    Please extract the physical locations from the provided HTML content. Return your findings in a JSON output following this structure:\n                    {\n                        "Physical_locations": [\n                            "Location 1",\n                            "Location 2",\n                            ...\n                        ]\n                    }\n                        Only return the JSON and nothing else. If no locations are found, return:\n                    {\n                        "Physical_locations": []\n                    }\n                ',
                htmlcontent: data,
              }),
            }),
          ];
        case 3:
          get_locations = _a.sent();
          return [4 /*yield*/, get_locations.json()];
        case 4:
          extract_location = _a.sent();
          locations = extractPhysicalLocations(extract_location);
          return [2 /*return*/, { data: data, locations: locations }];
      }
    });
  });
};
function extractPhysicalLocations(jsonArray) {
  // Initialize an empty array to hold all locations
  var combinedLocations = [];
  // Loop through each JSON string in the array
  for (var _i = 0, jsonArray_1 = jsonArray; _i < jsonArray_1.length; _i++) {
    var jsonString = jsonArray_1[_i];
    // Parse the JSON string into an object
    var data = JSON.parse(jsonString);
    // Extract the Physical_locations array
    var locations = data.Physical_locations || [];
    // Combine the locations into the result array
    combinedLocations = combinedLocations.concat(locations);
  }
  return combinedLocations;
}
//# sourceMappingURL=fetchWebsiteData.js.map
