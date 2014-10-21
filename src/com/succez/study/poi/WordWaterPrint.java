package com.succez.study.poi;

import com.aspose.words.Document;
import com.aspose.words.DocumentBuilder;
import com.aspose.words.HeaderFooter;
import com.aspose.words.HeaderFooterType;
import com.aspose.words.HorizontalAlignment;
import com.aspose.words.Paragraph;
import com.aspose.words.RelativeHorizontalPosition;
import com.aspose.words.RelativeVerticalPosition;
import com.aspose.words.Section;
import com.aspose.words.SectionCollection;
import com.aspose.words.Shape;
import com.aspose.words.ShapeType;
import com.aspose.words.VerticalAlignment;
import com.aspose.words.WrapType;

/**
 * 给word加水印
 */
public class WordWaterPrint {
	public static final String fn = "E:\\aa\\爱他美.doc";
	private static final String imgfn = "E:\\aa\\waterprint.jpg";
	
	public static void main(String [] args) throws Exception {
		Document doc = new Document(fn);
		DocumentBuilder builder = new DocumentBuilder(doc);
		Shape shape = new Shape(doc, ShapeType.IMAGE);
		shape.getImageData().setImage(imgfn);
		shape.setWrapType(WrapType.NONE);
		shape.setBehindText(true);
		
		shape.setWidth(500);
		shape.setHeight(500);
		shape.setRelativeHorizontalPosition(RelativeHorizontalPosition.PAGE);
		shape.setHorizontalAlignment(HorizontalAlignment.CENTER);
		shape.setRelativeVerticalPosition(RelativeVerticalPosition.PAGE);
		shape.setVerticalAlignment(VerticalAlignment.CENTER);
		
		
		Paragraph watermarkPara = new Paragraph(doc);
		watermarkPara.appendChild(shape);
		
		SectionCollection sections = doc.getSections();
		for (int i = 0; i < sections.getCount(); i++) {
			Section sect = sections.get(i);
			// There could be up to three different headers in each section, since we want
			// the watermark to appear on all pages, insert into all headers.
			InsertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_PRIMARY);
			InsertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_FIRST);
			InsertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_EVEN);
		}
		
		watermarkPara.appendChild(shape);
//		builder.insertNode(shape);
		
		doc.save("E:\\aa\\bb.doc");
	}
	
	private static void InsertWatermarkIntoHeader(Paragraph watermarkPara, Section sect, int headerType)
			throws Exception {
		HeaderFooter header = sect.getHeadersFooters().getByHeaderFooterType(headerType);

		if (header == null) {
			// There is no header of the specified type in the current section, create it.
			header = new HeaderFooter(sect.getDocument(), headerType);
			sect.getHeadersFooters().add(header);
		}

		// Insert a clone of the watermark into the header.
		header.appendChild(watermarkPara.deepClone(true));
	}
}
