package com.succez.study.poi;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.StringWriter;

import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.usermodel.CharacterRun;
import org.apache.poi.hwpf.usermodel.Paragraph;
import org.apache.poi.hwpf.usermodel.Range;
import org.apache.poi.hwpf.usermodel.Section;

import com.aspose.words.Document;
import com.aspose.words.HtmlFixedSaveOptions;
import com.aspose.words.HtmlSaveOptions;
import com.aspose.words.IImageSavingCallback;
import com.aspose.words.ImageSavingArgs;
import com.aspose.words.SaveFormat;
import com.succez.bi.activedoc.impl.aspose.AsposeUtil;

public class ReadWord {

	public static String path = "E:\\知识库\\法律法规\\国资委工作动态\\《中国企业法律顾问制度发展研究报告》课题通过评审验收20080605.doc";
	
	public static String  path2 = "E:\\知识库\\法律法规\\全国人民代表大会\\全国人大常委会关于修改《中华人民共和国兵役法》决定20111031.doc";
	
	public static String  img2 = "E:\\知识库\\法律法规\\国资委政策发布\\国务院国资委召开中央企业法制工作研讨会20091204.doc";
	
	public static String  img3 = "E:\\知识库\\法律法规\\国资委工作动态\\东航集团精心组织开展“五五”普法知识竞赛20081104.doc";
	
	static {
		AsposeUtil.licence();
	}

	public static void main(String[] args) throws Exception {
//		writeHtml();
//		writeOneHtml();
//		writeXps();
		writePdf();
	}
	
	
	public static void writePdf() throws Exception {
		FileInputStream in = new FileInputStream("F:\\aa\\test.docx");
		try{
			Document doc = createDocument(in);
			doc.save("F:\\aa\\t1t1.pdf", SaveFormat.PDF);
		}finally{
			in.close();
		}
	}
	
	public static void writeHtml() throws Exception {
		//AsposeUtil.licence();
		InputStream in = getWordFileInputStream();
		try{
			Document doc = createDocument(in);
			
			//doc.save("e:\\aa\\dd.html");
//			ByteArrayOutputStream out = new ByteArrayOutputStream();
			FileOutputStream out = new FileOutputStream("e:\\aa\\dd.html");
			
			ExportImage image = new ExportImage();
			HtmlSaveOptions saveOptions = new HtmlSaveOptions();
			saveOptions.setImageSavingCallback(image);
			saveOptions.setImagesFolder("E:\\aa\\images");
			doc.save(out, saveOptions);
//			System.out.println(out.toString(UtilConst.UTF8));
		}finally{
			in.close();
		}
	}
	
	public static void writeOneHtml() throws Exception {
//		HtmlSaveOptions saveOptions = new HtmlSaveOptions();
		HtmlFixedSaveOptions saveOptions = new HtmlFixedSaveOptions();
		saveOptions.setExportEmbeddedImages(true);
		saveOptions.setExportEmbeddedCss(true);
		saveOptions.setExportEmbeddedFonts(true);
//		saveOptions.setExportImagesAsBase64(true);
		InputStream in = getWordFileInputStream();
		try{
			Document doc = createDocument(in);
			doc.save(new FileOutputStream("e:\\aa\\one2.html"), saveOptions);
		}finally{
			in.close();
		}
	}
	
	public static void writeXps()throws Exception{
		InputStream in = getWordFileInputStream();
		try{
			Document doc = createDocument(in);
			doc.save(new FileOutputStream("e:\\aa\\one2.xps"), SaveFormat.XPS);
		}finally{
			in.close();
		}
	}
	
	public static InputStream getWordFileInputStream() throws Exception{
		 return new FileInputStream(img2);
	}
	
	public static void aspose() throws Exception {
		FileInputStream in = new FileInputStream(path);
		try{
			Document doc = createDocument(in);
			
			StringWriter out = new StringWriter(); 
			
//			HtmlWriter writer = new HtmlWriter(out, null);
//			
//			
//			Word2Html html = new Word2Html();
//			html.convert(doc, true, null, writer);
			
			System.out.println(out.toString());
		}finally{
			in.close();
		}
	}
	
	public static Document createDocument(InputStream ins) throws Exception{
		return new Document(ins);
	}

	public static String wordToHtml() throws Exception {
		HWPFDocument doc = new HWPFDocument(new FileInputStream(path));
		Range r = doc.getRange();

		for (int x = 0; x < r.numSections(); x++) {
			Section s = r.getSection(x);
			for (int y = 0; y < s.numParagraphs(); y++) {
				Paragraph p = s.getParagraph(y);
				for (int z = 0; z < p.numCharacterRuns(); z++) {
					//character run
					CharacterRun run = p.getCharacterRun(z);
					//character run text
					String text = run.text();
					// show us the text
					System.out.print(text);
				}
				// use a new line at the paragraph break
				System.out.println();
			}
		}
		return null;
	}
	
	

	/**
	 * 效果不行
	 * @return
	 * @throws Exception
	 */
	public static String readText() throws Exception {
		FileInputStream in = new FileInputStream(path);
		try {
			HWPFDocument doc = new HWPFDocument(in);
			Range ran = doc.getRange();
			return ran.text();
		}
		finally {
			in.close();
		}
	}
}

class ExportImage implements IImageSavingCallback{
	
	public ExportImage(){
		
	}

	@Override
	public void imageSaving(ImageSavingArgs arg0) throws Exception {
		System.out.println(arg0.getImageFileName());
		arg0.setKeepImageStreamOpen(false);
		arg0.setImageFileName("xxaq1111.jpg");
	}
}
