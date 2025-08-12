import { fromBuffer } from "pdf2pic";
import Tesseract from "tesseract.js";

// PDF → OCR
export async function extractTextFromPDF(buffer) {
  const convert = fromBuffer(buffer, {
    density: 300,
    format: "png",
    width: 1024,
    height: 1024
  });

  let text = "";
  const pages = await convert.bulk(-1, true); // -1 => all pages

  for (let page of pages) {
    const { data: { text: ocrText } } = await Tesseract.recognize(page.path, "eng");
    text += ocrText + "\n";
  }

  return text;
}

// Image → OCR
export async function extractTextFromImage(buffer) {
  const { data: { text } } = await Tesseract.recognize(buffer, "eng");
  return text;
}
