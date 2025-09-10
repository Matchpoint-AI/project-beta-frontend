import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { Document, HeadingLevel, Packer, Paragraph } from 'docx';
import emojiRegex from 'emoji-regex';
import { getServiceURL } from '../helpers/getServiceURL';

const fetchImageAsDataURL = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result); // Get the data URL part
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const fetchAndCreatePDF = async (
  id: string,
  endpointUrl: string,
  token: string
): Promise<Blob | undefined> => {
  const params = new URLSearchParams({ campaign_id: id });
  try {
    const response = await fetch(`${endpointUrl}/api/v1/getPdfData?${params}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.json();
    if (!data) return;

    return await createBrandProfilePDF(
      data.client_request,
      data.brand_profile,
      data.campaign_brief
    );
  } catch (_error) {
    // Error fetching campaign data
  }
};

const createBrandProfilePDF = async (
  clientRequest: Record<string, unknown>,
  brandProfile: Record<string, unknown>,
  campaignBrief: Record<string, unknown>
) => {
  const doc = new jsPDF();

  const mapColorsToReadable = (colors: string[], convertedColors: Array<{ name?: string }>) => {
    return colors.map((hex, index) => {
      const convertedColor = convertedColors[index];
      return convertedColor && convertedColor.name ? `${hex} (${convertedColor.name})` : hex; // Fallback to hex if name is not available
    });
  };

  // Fetch human-readable color names from the color API for brandProfile.colors
  const profileConvertedColors =
    clientRequest.primary_brand_profile && clientRequest.primary_brand_profile.length > 0
      ? await convertColors(clientRequest.primary_brand_profile)
      : [];

  const profileColors =
    clientRequest.primary_brand_profile && profileConvertedColors.length > 0
      ? mapColorsToReadable(clientRequest.primary_brand_profile, profileConvertedColors)
      : clientRequest.primary_brand_profile; // Fallback to hex if no readable names are found

  const convertedColors =
    brandProfile.colors && brandProfile.colors.length > 0
      ? await convertColors(brandProfile.colors)
      : [];

  const colors =
    brandProfile.colors && convertedColors.length > 0
      ? mapColorsToReadable(brandProfile.colors, convertedColors)
      : brandProfile.colors; // Fallback to hex if no readable names are found
  // Set title as Business Name from clientRequest (e.g., "Undefined Beauty")
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${clientRequest.business_name}`, 10, 10);

  // Client Request Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Request', 10, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`- Business Name: ${clientRequest.business_name}`, 10, 30);
  doc.text(`- Website URL: ${clientRequest.website_url}`, 10, 40);
  doc.text(`- Brand Guidelines PDF: ${clientRequest.brand_guidelines_pdf}`, 10, 50);
  doc.text(`- Logo: ${clientRequest.logo}`, 10, 60);
  // Primary Brand Colors for clientRequest (with fetched readable color names)
  doc.text(
    `- Primary Brand Colors: ${profileColors.length ? profileColors.join(', ') : 'Not Available'}`,
    10,
    70
  );
  doc.text(`- Campaign Name: ${clientRequest.campaign_name}`, 10, 80);
  doc.text(`- Campaign Purpose: ${clientRequest.campaign_purpose}`, 10, 90);

  // Target Audience
  doc.setFont('helvetica', 'bold');
  doc.text('- Target Audience:', 10, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`    - Gender: ${clientRequest.target_purpose.gender}`, 10, 110);
  doc.text(`    - Race/Ethnicity: ${clientRequest.target_purpose.race_ethnicity}`, 10, 120);
  doc.text(`    - Age Range: ${clientRequest.target_purpose.age_range.join(', ')}`, 10, 130);
  doc.text(`    - Interests: ${clientRequest.target_purpose.interests.join(', ')}`, 10, 140);

  doc.text(`- Product/Service to Promote: ${clientRequest.product_service}`, 10, 150);

  // Add a new page for the Brand Profile
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Brand Profile', 10, 10);

  // Industry and Vertical
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Industry: ${brandProfile.industry}`, 10, 20);
  doc.text(`Vertical: ${brandProfile.vertical}`, 10, 30);

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

  // Start positioning for the values
  let yOffset = 70; // Initial y position for the first value
  brandProfile.values.forEach((value) => {
    doc.text(`- ${value}`, 10, yOffset);
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
    colors.forEach((color, _index) => {
      doc.text(`- ${color}`, 10, yOffset);
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
  doc.text(`- Campaign Name: ${campaignBrief.campaign_name}`, 10, 20);
  doc.text(`- Brand: ${campaignBrief.brand}`, 10, 30);

  // Product Details
  doc.text('- Product:', 10, 40);
  doc.text(`    - Name: ${campaignBrief.product.name}`, 10, 50);
  doc.text(`    - Link: ${campaignBrief.product.link}`, 10, 60);
  doc.text(`    - Differentiators: ${campaignBrief.product.differentiators}`, 10, 70);
  doc.text(`    - Primary Ingredients: ${campaignBrief.product.primary_ingredients}`, 10, 80);
  doc.text(`    - Benefits: ${campaignBrief.product.benefits}`, 10, 90);

  // Target Audience
  doc.setFont('helvetica', 'bold');
  doc.text('- Target Audience:', 10, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`    - Gender: ${campaignBrief.target_purpose.gender}`, 10, 110);
  doc.text(`    - Race/Ethnicity: ${campaignBrief.target_purpose.race_ethnicity}`, 10, 120);
  doc.text(`    - Age Range: ${campaignBrief.target_purpose.age_range.join(', ')}`, 10, 130);
  doc.text(`    - Interests: ${campaignBrief.target_purpose.interests.join(', ')}`, 10, 140);

  // Campaign Purpose and Timing
  doc.setFont('helvetica', 'bold');
  doc.text(`- Campaign Purpose: ${campaignBrief.campaign_purpose}`, 10, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('- Campaign Timing:', 10, 160);
  doc.text(`    - Duration: ${campaignBrief.campaign_timing.duration || 'Not specified'}`, 10, 170);
  doc.text(`    - Posts per day: ${campaignBrief.campaign_timing.post_per_day}`, 10, 180);

  // Calculate the total deliverables
  const durationWeeks = campaignBrief.campaign_timing.duration || 0; // Duration in weeks
  const postsPerDay = campaignBrief.campaign_timing.post_per_day || 3; // Default posts per day is 3
  const totalDeliverables = durationWeeks * 7 * postsPerDay;

  // Deliverables Section
  doc.setFont('helvetica', 'bold');
  doc.text('Deliverables', 10, 190);
  doc.setFont('helvetica', 'normal');
  doc.text(`- ${totalDeliverables} pieces of content (images and ad copy)`, 10, 200);

  // Generate the PDF and return as a blob
  return doc.output('blob');
};

// Helper function to remove emojis from text
const removeNewlines = (text: string): string => {
  return text.replace(/(\r\n|\n|\r)/gm, ' ');
};
const stripEmojis = (str: string) => {
  const regex = emojiRegex();
  return str.replace(regex, '').replace(/\s+/g, ' ').trim();
};
// Function to clean text by removing hidden characters and normalizing spaces
const cleanText = (str: string) => {
  return str
    .replace(/\u200B|\u200C|\u200D|\uFEFF|\uFE0F/g, '') // Remove zero-width spaces and other non-printable characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
};

// Combined function to strip emojis and clean text
const cleanAndStripEmojis = (str: string) => {
  const textWithoutEmojis = stripEmojis(str);
  const finalText = cleanText(textWithoutEmojis);
  return finalText;
};

const fetchImageDimensions = async (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = url;
  });
};

export const createImageThumbnailsPDF = async (
  weeksData: Array<
    Array<{
      dayIndex: number;
      posts: Array<{ approved: boolean; postIndex: number; image_url: string[]; text: string }>;
    }>
  >,
  currentValues: string[]
): Promise<Blob> => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const margin = 5; // Margin from the top and bottom of the page
  let previousDayIndex = null; // Track the last day index

  for (const [weekIndex, week] of weeksData.entries()) {
    const actualWeekNumber = currentValues[weekIndex].split(' ')[1];
    doc.setFontSize(16);
    doc.text(`Week ${actualWeekNumber}`, 10, 10);
    let yOffset = 20; // Initial y position for the first element after the week title

    for (const day of week) {
      if (previousDayIndex !== null && day.dayIndex !== previousDayIndex) {
        doc.addPage();
        yOffset = 10; // Reset yOffset for new page
      }

      previousDayIndex = day.dayIndex;
      doc.setFontSize(14);
      doc.text(`Day: ${day.dayIndex}`, 10, yOffset);
      yOffset += 10; // Move y position below the day title

      const imageWidth = 40; // Width of each image
      const imageHeight = 40; // Height of each image
      let scaledWidth = imageWidth;
      let scaledHeight = imageHeight;
      const gap = 10; // Gap between images
      for (const post of day.posts) {
        if (!post.approved) continue;
        const imageURLs = post.image_url;
        // Add Post label
        doc.setFontSize(12);
        doc.text(`Post ${post.postIndex}`, 10, yOffset);
        yOffset += 10; // Move y position below the post label

        for (let i = 0; i < imageURLs.length; i += 4) {
          let xOffset = 10; // Initial x position for the first image in the row

          // Check if there's enough space on the current page for the images
          if (yOffset + imageHeight + 10 > pageHeight - margin) {
            doc.addPage();
            yOffset = 10; // Reset yOffset for new page
          }

          // Add up to 4 images side by side
          for (let j = 0; j < 4 && i + j < imageURLs.length; j++) {
            const imageURL = imageURLs[i + j];
            const dataURL = await fetchImageAsDataURL(imageURL);
            const { width: originalWidth, height: originalHeight } =
              await fetchImageDimensions(imageURL);

            // Calculate the scaled dimensions while maintaining aspect ratio
            const aspectRatio = originalWidth / originalHeight;
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
          }

          // Add the caption below the images
          // yOffset += imageHeight + 10; // Move y position below the images
          yOffset += scaledHeight + 10; // Move y position below the images
          doc.setFontSize(10);
          const textWidth = 180; // Maximum width for the text
          const _data = removeNewlines(post.text);
          const finalText = cleanAndStripEmojis(_data);

          const splitText = doc.splitTextToSize(finalText, textWidth);

          // Check if there's enough space on the current page for the text
          splitText.forEach((line) => {
            const lineHeight = doc.getTextDimensions(line).h + 2; // Height of the text line
            if (yOffset + lineHeight > pageHeight - margin) {
              doc.addPage();
              yOffset = 10; // Reset yOffset for new page
            }
            doc.text(line, 10, yOffset, { charSpace: 0 });
            yOffset += lineHeight; // Move y position below the text line
          });

          yOffset += 10; // Add extra space after the caption (adjust as needed)
        }
      }
    }
  }

  return doc.output('blob');
};

export const createWordDocument = async (
  weeksData: Array<Array<{ dayIndex: number; posts: Array<{ postIndex: number; text: string }> }>>,
  currentValues: string[]
) => {
  const sections = [];

  for (const [weekIndex, week] of weeksData.entries()) {
    const actualWeekNumber = currentValues[weekIndex].split(' ')[1];
    const weekChildren = [
      new Paragraph({
        text: `Week ${actualWeekNumber}`,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          after: 200, // Add space after the week heading
        },
      }),
    ];

    // const dayKeys = Object.keys(week);
    for (const day of week) {
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
          text: `Day ${day.dayIndex}`,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200, // Add space before the day heading
            after: 150, // Add space after the day heading
          },
        })
      );

      for (const post of day.posts) {
        // const post = week[dayKey][postKey];
        weekChildren.push(
          new Paragraph({
            text: `Post ${post.postIndex}`,
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

  const doc = new Document({
    creator: 'Your Name',
    title: 'Your Document Title',
    description: 'Your Document Description',
    sections: sections,
  });

  return await Packer.toBlob(doc);
};

export const organizeAndSavePosts = async (
  weeksData: Array<
    Array<{ dayIndex: number; posts: Array<{ postIndex: number; image_url: string[] }> }>
  >,
  bigFolder: JSZip,
  currentValues: string[]
) => {
  for (const [weekIndex, week] of weeksData.entries()) {
    const actualWeekNumber = currentValues[weekIndex].split(' ')[1];

    const weekFolder = bigFolder.folder(`week_${actualWeekNumber}`);

    for (const day of week) {
      const dayFolder = weekFolder.folder(`day_${day.dayIndex}`);

      for (const post of day.posts) {
        const postFolder = dayFolder.folder(`post_${post.postIndex}`);
        // const post = week[dayKey][postKey];
        // postFolder.file("caption.txt", post.text);

        if (post.image_url.length === 1) {
          const dataURL = await fetchImageAsDataURL(post.image_url[0]);
          const base64Data = dataURL.split(',')[1];
          const mimeType = dataURL.split(';')[0].split(':')[1];
          const extension = mimeType.split('/')[1];
          postFolder.file(`image_1.${extension}`, base64Data, {
            base64: true,
          });
        } else {
          const imagesFolder = postFolder.folder('images');
          for (const [index, image] of post.image_url.entries()) {
            const dataURL = await fetchImageAsDataURL(image);
            const base64Data = dataURL.split(',')[1];
            const mimeType = dataURL.split(';')[0].split(':')[1];
            const extension = mimeType.split('/')[1];
            imagesFolder.file(`image_${index + 1}.${extension}`, base64Data, {
              base64: true,
            });
          }
        }
      }
    }
  }
};

const convertColors = async (colors: string[]): Promise<Array<{ name?: string }>> => {
  // Define the request body
  const url = getServiceURL('llm');
  const requestBody = {
    hex_codes: colors, // Hex codes to send
  };

  try {
    // Make the fetch call to the FastAPI endpoint
    const response = await fetch(`${url}/api/v1/llm/convert-color`, {
      method: 'POST', // Use OPTIONS method based on the endpoint you defined
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // Convert request body to JSON
    });

    // Parse the JSON response
    const data = await response.json();
    return data;
    // Handle the response (log it or use it)
  } catch (_error) {
    // Error fetching the converted colors
  }
};
