import HTMLtoDOCX from "html-to-docx";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const params = await request.json();

    // Validate the input
    if (!params.htmlString) {
      console.error("No htmlString provided in request");
      return NextResponse.json(
        { error: "htmlString is required" },
        { status: 400 }
      );
    }

    console.log(
      "Received htmlString:",
      params.htmlString.substring(0, 100) + "..."
    );

    const fileBuffer = await HTMLtoDOCX(params.htmlString, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    // Convertir le buffer en Response avec les bons headers
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=export.docx",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}
