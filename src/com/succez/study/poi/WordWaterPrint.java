package com.succez.study.poi;

import java.io.FileInputStream;
import java.io.InputStream;

import org.apache.poi.util.IOUtils;

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
		DocumentBuilder builder = new DocumentBuilder();
		
		FileInputStream imgIn = new FileInputStream(imgfn);
		FileInputStream docIn = new FileInputStream(fn);
		Document doc;
		try{
			doc = insertIntoWatermark(docIn, imgIn);
			doc.save("E:\\aa\\bb.doc");
		}finally{
			IOUtils.closeQuietly(imgIn);
			IOUtils.closeQuietly(docIn);
		}
	}
	
	public static Document insertIntoWatermark(InputStream docIn, InputStream imgIn) throws Exception{
		Document doc = new Document(docIn);
		Paragraph watermarkPara = new Paragraph(doc);
		
		Shape shape = createWatermark(doc, imgIn);
		watermarkPara.appendChild(shape);
		SectionCollection sections = doc.getSections();
		for (int i = 0; i < sections.getCount(); i++) {
			Section sect = sections.get(i);
			insertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_PRIMARY);
			insertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_FIRST);
			insertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_EVEN);
		}
		return doc;
	}
	
	public static Shape createWatermark(Document doc, InputStream imgIn) throws Exception {
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
		return shape;
	}
	
	public static void insertWatermarkIntoHeader(Paragraph watermarkPara, Section sect, int headerType)
			throws Exception {
		HeaderFooter header = sect.getHeadersFooters().getByHeaderFooterType(headerType);

		if (header == null) {
			header = new HeaderFooter(sect.getDocument(), headerType);
			sect.getHeadersFooters().add(header);
		}
		header.appendChild(watermarkPara.deepClone(true));
	}
}
