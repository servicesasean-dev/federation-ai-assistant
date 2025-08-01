import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_DRIVE_FOLDER_ID = '1ZAxSrDTbmEaOSeZv-JtLy9A-TRre8HQx';

async function fetchFileList() {
  const url = `https://www.googleapis.com/drive/v3/files?q='${GOOGLE_DRIVE_FOLDER_ID}'+in+parents&key=${GOOGLE_DRIVE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.files || [];
}

async function fetchCSV(fileId) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${GOOGLE_DRIVE_API_KEY}`;
  const res = await fetch(url);
  return await res.text();
}

function formatAsContext(csvText) {
  return `Here is federation member data:\n${csvText}\nUse this data to answer any related questions.`;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const message = searchParams.get('message') || 'Hi';

  try {
    const files = await fetchFileList();
    const csvFiles = files.filter(f => f.mimeType.includes('csv') || f.name.endsWith('.csv'));

    let context = '';

    for (const file of csvFiles) {
      const csvText = await fetchCSV(file.id);
      context += formatAsContext(csvText) + '\n';
    }

    const openaiRes = await fetch('https://api
