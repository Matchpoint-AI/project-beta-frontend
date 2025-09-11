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
import { jsPDF } from 'jspdf';
import { Document, HeadingLevel, Packer, Paragraph } from 'docx';
import emojiRegex from 'emoji-regex';
import { getServiceURL } from '../helpers/getServiceURL';
var fetchImageAsDataURL = function (url) {
  return __awaiter(void 0, void 0, void 0, function () {
    var response, blob;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, fetch(url)];
        case 1:
          response = _a.sent();
          return [4 /*yield*/, response.blob()];
        case 2:
          blob = _a.sent();
          return [
            2 /*return*/,
            new Promise(function (resolve, reject) {
              var reader = new FileReader();
              reader.onloadend = function () {
                resolve(reader.result); // Get the data URL part
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            }),
          ];
      }
    });
  });
};
export var fetchAndCreatePDF = function (id, endpointUrl, token) {
  return __awaiter(void 0, void 0, void 0, function () {
    var params, response, data, _error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          params = new URLSearchParams({ campaign_id: id });
          _a.label = 1;
        case 1:
          _a.trys.push([1, 5, , 6]);
          return [
            4 /*yield*/,
            fetch(''.concat(endpointUrl, '/api/v1/getPdfData?').concat(params), {
              method: 'GET',
              headers: { Authorization: 'Bearer '.concat(token) },
            }),
          ];
        case 2:
          response = _a.sent();
          if (!response.ok) throw new Error('Failed to fetch data');
          return [4 /*yield*/, response.json()];
        case 3:
          data = _a.sent();
          if (!data) return [2 /*return*/];
          return [
            4 /*yield*/,
            createBrandProfilePDF(data.client_request, data.brand_profile, data.campaign_brief),
          ];
        case 4:
          return [2 /*return*/, _a.sent()];
        case 5:
          _error_1 = _a.sent();
          return [3 /*break*/, 6];
        case 6:
          return [2 /*return*/];
      }
    });
  });
};
var createBrandProfilePDF = function (clientRequest, brandProfile, campaignBrief) {
  return __awaiter(void 0, void 0, void 0, function () {
    var doc,
      mapColorsToReadable,
      profileConvertedColors,
      _a,
      profileColors,
      convertedColors,
      _b,
      colors,
      yOffset,
      durationWeeks,
      postsPerDay,
      totalDeliverables;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          doc = new jsPDF();
          mapColorsToReadable = function (colors, convertedColors) {
            return colors.map(function (hex, index) {
              var convertedColor = convertedColors[index];
              return convertedColor && convertedColor.name
                ? ''.concat(hex, ' (').concat(convertedColor.name, ')')
                : hex; // Fallback to hex if name is not available
            });
          };
          if (
            !(clientRequest.primary_brand_profile && clientRequest.primary_brand_profile.length > 0)
          )
            return [3 /*break*/, 2];
          return [4 /*yield*/, convertColors(clientRequest.primary_brand_profile)];
        case 1:
          _a = _c.sent();
          return [3 /*break*/, 3];
        case 2:
          _a = [];
          _c.label = 3;
        case 3:
          profileConvertedColors = _a;
          profileColors =
            clientRequest.primary_brand_profile && profileConvertedColors.length > 0
              ? mapColorsToReadable(clientRequest.primary_brand_profile, profileConvertedColors)
              : clientRequest.primary_brand_profile;
          if (!(brandProfile.colors && brandProfile.colors.length > 0)) return [3 /*break*/, 5];
          return [4 /*yield*/, convertColors(brandProfile.colors)];
        case 4:
          _b = _c.sent();
          return [3 /*break*/, 6];
        case 5:
          _b = [];
          _c.label = 6;
        case 6:
          convertedColors = _b;
          colors =
            brandProfile.colors && convertedColors.length > 0
              ? mapColorsToReadable(brandProfile.colors, convertedColors)
              : brandProfile.colors;
          // Set title as Business Name from clientRequest (e.g., "Undefined Beauty")
          doc.setFontSize(20);
          doc.setFont('helvetica', 'bold');
          doc.text(''.concat(clientRequest.business_name), 10, 10);
          // Client Request Section
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Client Request', 10, 20);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.text('- Business Name: '.concat(clientRequest.business_name), 10, 30);
          doc.text('- Website URL: '.concat(clientRequest.website_url), 10, 40);
          doc.text('- Brand Guidelines PDF: '.concat(clientRequest.brand_guidelines_pdf), 10, 50);
          doc.text('- Logo: '.concat(clientRequest.logo), 10, 60);
          // Primary Brand Colors for clientRequest (with fetched readable color names)
          doc.text(
            '- Primary Brand Colors: '.concat(
              profileColors.length ? profileColors.join(', ') : 'Not Available'
            ),
            10,
            70
          );
          doc.text('- Campaign Name: '.concat(clientRequest.campaign_name), 10, 80);
          doc.text('- Campaign Purpose: '.concat(clientRequest.campaign_purpose), 10, 90);
          // Target Audience
          doc.setFont('helvetica', 'bold');
          doc.text('- Target Audience:', 10, 100);
          doc.setFont('helvetica', 'normal');
          doc.text('    - Gender: '.concat(clientRequest.target_purpose.gender), 10, 110);
          doc.text(
            '    - Race/Ethnicity: '.concat(clientRequest.target_purpose.race_ethnicity),
            10,
            120
          );
          doc.text(
            '    - Age Range: '.concat(clientRequest.target_purpose.age_range.join(', ')),
            10,
            130
          );
          doc.text(
            '    - Interests: '.concat(clientRequest.target_purpose.interests.join(', ')),
            10,
            140
          );
          doc.text('- Product/Service to Promote: '.concat(clientRequest.product_service), 10, 150);
          // Add a new page for the Brand Profile
          doc.addPage();
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Brand Profile', 10, 10);
          // Industry and Vertical
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Industry: '.concat(brandProfile.industry), 10, 20);
          doc.text('Vertical: '.concat(brandProfile.vertical), 10, 30);
          // Mission
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Mission', 10, 40);
          doc.setFont('helvetica', 'normal');
          doc.text(brandProfile.mission.join(' '), 10, 50);
          // Values Section (Dynamically generated from values array)
          doc.setFont('helvetica', 'bold');
          doc.text('Values', 10, 60);
          doc.setFont('helvetica', 'normal');
          yOffset = 70;
          brandProfile.values.forEach(function (value) {
            doc.text('- '.concat(value), 10, yOffset);
            yOffset += 10; // Move down for the next value
          });
          // Brand Persona
          doc.setFont('helvetica', 'bold');
          doc.text('Brand Persona', 10, yOffset + 10);
          doc.setFont('helvetica', 'normal');
          doc.text(brandProfile.brand_persona.join(', '), 10, yOffset + 20);
          // Tone of Voice
          doc.setFont('helvetica', 'bold');
          doc.text('Tone of Voice', 10, yOffset + 30);
          doc.setFont('helvetica', 'normal');
          doc.text(brandProfile.tone_of_voice.join(', '), 10, yOffset + 40);
          // Colors Section with Human-Readable Color Names or Not Available
          doc.setFont('helvetica', 'bold');
          doc.text('Colors', 10, yOffset + 50);
          doc.setFont('helvetica', 'normal');
          if (colors.length > 0) {
            yOffset += 60;
            colors.forEach(function (color, _index) {
              doc.text('- '.concat(color), 10, yOffset);
              yOffset += 10; // Adjust y position for the next color
            });
          } else {
            doc.text('Not Available', 10, yOffset + 60);
          }
          // Add a new page for the Campaign Brief
          doc.addPage();
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Campaign Brief', 10, 10);
          // Campaign Details
          doc.setFontSize(12);
          doc.text('- Campaign Name: '.concat(campaignBrief.campaign_name), 10, 20);
          doc.text('- Brand: '.concat(campaignBrief.brand), 10, 30);
          // Product Details
          doc.text('- Product:', 10, 40);
          doc.text('    - Name: '.concat(campaignBrief.product.name), 10, 50);
          doc.text('    - Link: '.concat(campaignBrief.product.link), 10, 60);
          doc.text('    - Differentiators: '.concat(campaignBrief.product.differentiators), 10, 70);
          doc.text(
            '    - Primary Ingredients: '.concat(campaignBrief.product.primary_ingredients),
            10,
            80
          );
          doc.text('    - Benefits: '.concat(campaignBrief.product.benefits), 10, 90);
          // Target Audience
          doc.setFont('helvetica', 'bold');
          doc.text('- Target Audience:', 10, 100);
          doc.setFont('helvetica', 'normal');
          doc.text('    - Gender: '.concat(campaignBrief.target_purpose.gender), 10, 110);
          doc.text(
            '    - Race/Ethnicity: '.concat(campaignBrief.target_purpose.race_ethnicity),
            10,
            120
          );
          doc.text(
            '    - Age Range: '.concat(campaignBrief.target_purpose.age_range.join(', ')),
            10,
            130
          );
          doc.text(
            '    - Interests: '.concat(campaignBrief.target_purpose.interests.join(', ')),
            10,
            140
          );
          // Campaign Purpose and Timing
          doc.setFont('helvetica', 'bold');
          doc.text('- Campaign Purpose: '.concat(campaignBrief.campaign_purpose), 10, 150);
          doc.setFont('helvetica', 'normal');
          doc.text('- Campaign Timing:', 10, 160);
          doc.text(
            '    - Duration: '.concat(campaignBrief.campaign_timing.duration || 'Not specified'),
            10,
            170
          );
          doc.text(
            '    - Posts per day: '.concat(campaignBrief.campaign_timing.post_per_day),
            10,
            180
          );
          durationWeeks = campaignBrief.campaign_timing.duration || 0;
          postsPerDay = campaignBrief.campaign_timing.post_per_day || 3;
          totalDeliverables = durationWeeks * 7 * postsPerDay;
          // Deliverables Section
          doc.setFont('helvetica', 'bold');
          doc.text('Deliverables', 10, 190);
          doc.setFont('helvetica', 'normal');
          doc.text(
            '- '.concat(totalDeliverables, ' pieces of content (images and ad copy)'),
            10,
            200
          );
          // Generate the PDF and return as a blob
          return [2 /*return*/, doc.output('blob')];
      }
    });
  });
};
// Helper function to remove emojis from text
var removeNewlines = function (text) {
  return text.replace(/(\r\n|\n|\r)/gm, ' ');
};
var stripEmojis = function (str) {
  var regex = emojiRegex();
  return str.replace(regex, '').replace(/\s+/g, ' ').trim();
};
// Function to clean text by removing hidden characters and normalizing spaces
var cleanText = function (str) {
  return str
    .replace(/\u200B|\u200C|\u200D|\uFEFF|\uFE0F/g, '') // Remove zero-width spaces and other non-printable characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
};
// Combined function to strip emojis and clean text
var cleanAndStripEmojis = function (str) {
  var textWithoutEmojis = stripEmojis(str);
  var finalText = cleanText(textWithoutEmojis);
  return finalText;
};
var fetchImageDimensions = function (url) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [
        2 /*return*/,
        new Promise(function (resolve) {
          var img = new Image();
          img.onload = function () {
            return resolve({ width: img.width, height: img.height });
          };
          img.src = url;
        }),
      ];
    });
  });
};
export var createImageThumbnailsPDF = function (weeksData, currentValues) {
  return __awaiter(void 0, void 0, void 0, function () {
    var doc, pageHeight, margin, previousDayIndex, _loop_1, _i, _a, _b, weekIndex, week;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          doc = new jsPDF();
          pageHeight = doc.internal.pageSize.height;
          margin = 5;
          previousDayIndex = null;
          _loop_1 = function (weekIndex, week) {
            var actualWeekNumber,
              yOffset,
              _d,
              week_1,
              day,
              imageWidth,
              imageHeight,
              scaledWidth,
              scaledHeight,
              gap,
              _e,
              _f,
              post,
              imageURLs,
              i,
              xOffset,
              j,
              imageURL,
              dataURL,
              _g,
              originalWidth,
              originalHeight,
              aspectRatio,
              textWidth,
              _data,
              finalText,
              splitText;
            return __generator(this, function (_h) {
              switch (_h.label) {
                case 0:
                  actualWeekNumber = currentValues[weekIndex].split(' ')[1];
                  doc.setFontSize(16);
                  doc.text('Week '.concat(actualWeekNumber), 10, 10);
                  yOffset = 20;
                  ((_d = 0), (week_1 = week));
                  _h.label = 1;
                case 1:
                  if (!(_d < week_1.length)) return [3 /*break*/, 12];
                  day = week_1[_d];
                  if (previousDayIndex !== null && day.dayIndex !== previousDayIndex) {
                    doc.addPage();
                    yOffset = 10; // Reset yOffset for new page
                  }
                  previousDayIndex = day.dayIndex;
                  doc.setFontSize(14);
                  doc.text('Day: '.concat(day.dayIndex), 10, yOffset);
                  yOffset += 10; // Move y position below the day title
                  imageWidth = 40;
                  imageHeight = 40;
                  scaledWidth = imageWidth;
                  scaledHeight = imageHeight;
                  gap = 10;
                  ((_e = 0), (_f = day.posts));
                  _h.label = 2;
                case 2:
                  if (!(_e < _f.length)) return [3 /*break*/, 11];
                  post = _f[_e];
                  if (!post.approved) return [3 /*break*/, 10];
                  imageURLs = post.image_url;
                  // Add Post label
                  doc.setFontSize(12);
                  doc.text('Post '.concat(post.postIndex), 10, yOffset);
                  yOffset += 10; // Move y position below the post label
                  i = 0;
                  _h.label = 3;
                case 3:
                  if (!(i < imageURLs.length)) return [3 /*break*/, 10];
                  xOffset = 10;
                  // Check if there's enough space on the current page for the images
                  if (yOffset + imageHeight + 10 > pageHeight - margin) {
                    doc.addPage();
                    yOffset = 10; // Reset yOffset for new page
                  }
                  j = 0;
                  _h.label = 4;
                case 4:
                  if (!(j < 4 && i + j < imageURLs.length)) return [3 /*break*/, 8];
                  imageURL = imageURLs[i + j];
                  return [4 /*yield*/, fetchImageAsDataURL(imageURL)];
                case 5:
                  dataURL = _h.sent();
                  return [4 /*yield*/, fetchImageDimensions(imageURL)];
                case 6:
                  ((_g = _h.sent()), (originalWidth = _g.width), (originalHeight = _g.height));
                  aspectRatio = originalWidth / originalHeight;
                  scaledWidth = imageWidth;
                  scaledHeight = imageHeight;
                  // Adjust either width or height based on aspect ratio
                  if (aspectRatio > 1) {
                    scaledHeight = imageHeight / aspectRatio;
                  } else {
                    scaledWidth = imageWidth * aspectRatio;
                  }
                  doc.addImage(dataURL, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);
                  // xOffset += imageWidth + gap; // Increment x position for the next image
                  xOffset += scaledWidth + gap; // Increment x position for the next image
                  _h.label = 7;
                case 7:
                  j++;
                  return [3 /*break*/, 4];
                case 8:
                  // Add the caption below the images
                  // yOffset += imageHeight + 10; // Move y position below the images
                  yOffset += scaledHeight + 10; // Move y position below the images
                  doc.setFontSize(10);
                  textWidth = 180;
                  _data = removeNewlines(post.text);
                  finalText = cleanAndStripEmojis(_data);
                  splitText = doc.splitTextToSize(finalText, textWidth);
                  // Check if there's enough space on the current page for the text
                  splitText.forEach(function (line) {
                    var lineHeight = doc.getTextDimensions(line).h + 2; // Height of the text line
                    if (yOffset + lineHeight > pageHeight - margin) {
                      doc.addPage();
                      yOffset = 10; // Reset yOffset for new page
                    }
                    doc.text(line, 10, yOffset, { charSpace: 0 });
                    yOffset += lineHeight; // Move y position below the text line
                  });
                  yOffset += 10; // Add extra space after the caption (adjust as needed)
                  _h.label = 9;
                case 9:
                  i += 4;
                  return [3 /*break*/, 3];
                case 10:
                  _e++;
                  return [3 /*break*/, 2];
                case 11:
                  _d++;
                  return [3 /*break*/, 1];
                case 12:
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (_a = weeksData.entries()));
          _c.label = 1;
        case 1:
          if (!(_i < _a.length)) return [3 /*break*/, 4];
          ((_b = _a[_i]), (weekIndex = _b[0]), (week = _b[1]));
          return [5 /*yield**/, _loop_1(weekIndex, week)];
        case 2:
          _c.sent();
          _c.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, doc.output('blob')];
      }
    });
  });
};
export var createWordDocument = function (weeksData, currentValues) {
  return __awaiter(void 0, void 0, void 0, function () {
    var sections,
      _i,
      _a,
      _b,
      weekIndex,
      week,
      actualWeekNumber,
      weekChildren,
      _c,
      week_2,
      day,
      _d,
      _e,
      post,
      doc;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          sections = [];
          for (_i = 0, _a = weeksData.entries(); _i < _a.length; _i++) {
            ((_b = _a[_i]), (weekIndex = _b[0]), (week = _b[1]));
            actualWeekNumber = currentValues[weekIndex].split(' ')[1];
            weekChildren = [
              new Paragraph({
                text: 'Week '.concat(actualWeekNumber),
                heading: HeadingLevel.HEADING_1,
                spacing: {
                  after: 200, // Add space after the week heading
                },
              }),
            ];
            // const dayKeys = Object.keys(week);
            for (_c = 0, week_2 = week; _c < week_2.length; _c++) {
              day = week_2[_c];
              // const dayKey = dayKeys[i];
              // Check if we need to add a page break before this day
              // if (i > 0 && i % 2 === 0) {
              //   weekChildren.push(new Paragraph({ pageBreakBefore: true }));
              // }
              if (weekChildren.length > 1 && weekChildren.length % 2 === 0) {
                weekChildren.push(new Paragraph({ pageBreakBefore: true }));
              }
              weekChildren.push(
                new Paragraph({
                  text: 'Day '.concat(day.dayIndex),
                  heading: HeadingLevel.HEADING_2,
                  spacing: {
                    before: 200, // Add space before the day heading
                    after: 150, // Add space after the day heading
                  },
                })
              );
              for (_d = 0, _e = day.posts; _d < _e.length; _d++) {
                post = _e[_d];
                // const post = week[dayKey][postKey];
                weekChildren.push(
                  new Paragraph({
                    text: 'Post '.concat(post.postIndex),
                    heading: HeadingLevel.HEADING_3,
                    spacing: {
                      before: 150, // Add space before the post heading
                      after: 100, // Add space after the post heading
                    },
                  }),
                  new Paragraph({
                    text: post.text,
                    spacing: {
                      after: 200, // Add space after the post text
                    },
                  })
                );
              }
            }
            sections.push({
              properties: {},
              children: weekChildren,
            });
          }
          doc = new Document({
            creator: 'Your Name',
            title: 'Your Document Title',
            description: 'Your Document Description',
            sections: sections,
          });
          return [4 /*yield*/, Packer.toBlob(doc)];
        case 1:
          return [2 /*return*/, _f.sent()];
      }
    });
  });
};
export var organizeAndSavePosts = function (weeksData, bigFolder, currentValues) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _i,
      _a,
      _b,
      weekIndex,
      week,
      actualWeekNumber,
      weekFolder,
      _c,
      week_3,
      day,
      dayFolder,
      _d,
      _e,
      post,
      postFolder,
      dataURL,
      base64Data,
      mimeType,
      extension,
      imagesFolder,
      _f,
      _g,
      _h,
      index,
      image,
      dataURL,
      base64Data,
      mimeType,
      extension;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          ((_i = 0), (_a = weeksData.entries()));
          _j.label = 1;
        case 1:
          if (!(_i < _a.length)) return [3 /*break*/, 12];
          ((_b = _a[_i]), (weekIndex = _b[0]), (week = _b[1]));
          actualWeekNumber = currentValues[weekIndex].split(' ')[1];
          weekFolder = bigFolder.folder('week_'.concat(actualWeekNumber));
          ((_c = 0), (week_3 = week));
          _j.label = 2;
        case 2:
          if (!(_c < week_3.length)) return [3 /*break*/, 11];
          day = week_3[_c];
          dayFolder = weekFolder.folder('day_'.concat(day.dayIndex));
          ((_d = 0), (_e = day.posts));
          _j.label = 3;
        case 3:
          if (!(_d < _e.length)) return [3 /*break*/, 10];
          post = _e[_d];
          postFolder = dayFolder.folder('post_'.concat(post.postIndex));
          if (!(post.image_url.length === 1)) return [3 /*break*/, 5];
          return [4 /*yield*/, fetchImageAsDataURL(post.image_url[0])];
        case 4:
          dataURL = _j.sent();
          base64Data = dataURL.split(',')[1];
          mimeType = dataURL.split(';')[0].split(':')[1];
          extension = mimeType.split('/')[1];
          postFolder.file('image_1.'.concat(extension), base64Data, {
            base64: true,
          });
          return [3 /*break*/, 9];
        case 5:
          imagesFolder = postFolder.folder('images');
          ((_f = 0), (_g = post.image_url.entries()));
          _j.label = 6;
        case 6:
          if (!(_f < _g.length)) return [3 /*break*/, 9];
          ((_h = _g[_f]), (index = _h[0]), (image = _h[1]));
          return [4 /*yield*/, fetchImageAsDataURL(image)];
        case 7:
          dataURL = _j.sent();
          base64Data = dataURL.split(',')[1];
          mimeType = dataURL.split(';')[0].split(':')[1];
          extension = mimeType.split('/')[1];
          imagesFolder.file('image_'.concat(index + 1, '.').concat(extension), base64Data, {
            base64: true,
          });
          _j.label = 8;
        case 8:
          _f++;
          return [3 /*break*/, 6];
        case 9:
          _d++;
          return [3 /*break*/, 3];
        case 10:
          _c++;
          return [3 /*break*/, 2];
        case 11:
          _i++;
          return [3 /*break*/, 1];
        case 12:
          return [2 /*return*/];
      }
    });
  });
};
var convertColors = function (colors) {
  return __awaiter(void 0, void 0, void 0, function () {
    var url, requestBody, response, data, _error_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          url = getServiceURL('llm');
          requestBody = {
            hex_codes: colors, // Hex codes to send
          };
          _a.label = 1;
        case 1:
          _a.trys.push([1, 4, , 5]);
          return [
            4 /*yield*/,
            fetch(''.concat(url, '/api/v1/llm/convert-color'), {
              method: 'POST', // Use OPTIONS method based on the endpoint you defined
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody), // Convert request body to JSON
            }),
          ];
        case 2:
          response = _a.sent();
          return [4 /*yield*/, response.json()];
        case 3:
          data = _a.sent();
          return [2 /*return*/, data];
        case 4:
          _error_2 = _a.sent();
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
};
//# sourceMappingURL=exportUtils.js.map
