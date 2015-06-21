package com.succez.study.poi;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.usermodel.CharacterRun;
import org.apache.poi.hwpf.usermodel.Paragraph;
import org.apache.poi.hwpf.usermodel.Range;
import org.apache.poi.hwpf.usermodel.Section;
import org.apache.poi.util.IOUtils;

import com.aspose.words.Document;
import com.aspose.words.License;
import com.aspose.words.SaveFormat;
import com.aspose.words.SaveOptions;
import com.succez.commons.util.UtilConst;

public class ReadWord {

	public static String path = "E:\\知识库\\法律法规\\国资委工作动态\\《中国企业法律顾问制度发展研究报告》课题通过评审验收20080605.doc";
	
	public static String  path2 = "E:\\知识库\\法律法规\\全国人民代表大会\\全国人大常委会关于修改《中华人民共和国兵役法》决定20111031.doc";
	
	public static String  img2 = "E:\\知识库\\法律法规\\国资委政策发布\\国务院国资委召开中央企业法制工作研讨会20091204.doc";
	
	public static String  img3 = "E:\\知识库\\法律法规\\国资委工作动态\\东航集团精心组织开展“五五”普法知识竞赛20081104.doc";
	
	

	public static void main(String[] args) throws Exception {
		getLicense();
		aspose2();
	}
	
	
	public static void aspose2() throws Exception {
		//AsposeUtil.licence();
		FileInputStream in = new FileInputStream(img2);
		try{
			Document doc = createDocument(in);
			
			
			
			//doc.save("e:\\aa\\dd.html");
//			ByteArrayOutputStream out = new ByteArrayOutputStream();
			FileOutputStream out = new FileOutputStream("e:\\aa\\dd.html");
			
			ExportImage image = new ExportImage();
			SaveOptions saveOptions = doc.getSaveOptions();
			saveOptions.addHtmlExportImageSavingEventHandler(image);
			
			saveOptions.setExportImagesFolder("E:\\aa\\images");
			
			doc.save(out, SaveFormat.HTML);
			SaveFormat.DOC
//			System.out.println(out.toString(UtilConst.UTF8));
		}finally{
			in.close();
		}
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
	
	private static final String SUCCEZLSN = "succez.lsn";

	/**
	 * 注册Aspose控件
	 */
	public static void licence() {
		License license = new License();
		InputStream is = null;
		try {
			is = getLsnStream();
			if (is == null) {
				throw new RuntimeException("导出Word异常，无法获取组件注册信息");
			}
			else {
				license.setLicense(is);
			}
		}
		catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("导出Word异常，注册组件异常");
		}
		finally {
			IOUtils.closeQuietly(is);
		}
	}
	
	public static boolean getLicense(){
		boolean result = false;
		InputStream is = ReadWord.class.getResourceAsStream("license.xml"); 
		
		License aposeLic = new License();
		try {
			aposeLic.setLicense(is);
			result = true;
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * 获取注册码流，失败返回异常，或者null
	 * @return
	 * @throws Exception 
	 */
	@SuppressWarnings("unused")
	private static InputStream getLsnStream() throws Exception {
		InputStream is = ReadWord.class.getResourceAsStream(SUCCEZLSN);
		ZipInputStream zis = null;//将zip包转换为流
		try {
			zis = new ZipInputStream(is);
			if (zis == null)
				return null;
			ByteArrayOutputStream baos = new ByteArrayOutputStream();//将内部内容取出
			try {
				ZipEntry zipentry = null;
				while ((zipentry = zis.getNextEntry()) != null) {
					if (!zipentry.isDirectory()) {
						if (zipentry.getName().equals(SUCCEZLSN)) {
							while (true) {
								int b = zis.read();
								if (b == -1)
									break;
								baos.write(b);
							}
							zis.closeEntry();
							return new ByteArrayInputStream(baos.toByteArray());
						}
					}
				}
				return null;
			}
			finally {
				IOUtils.closeQuietly(zis);
				IOUtils.closeQuietly(baos);
			}
		}
		finally {//最后关闭is.close，以免导致解压失败
			IOUtils.closeQuietly(is);
		}
	}
}

class ExportImage implements ExportImageSavingEventHandler{
	
	public ExportImage(){
		
	}

	@Override
	public void htmlExportImageSaving(Object arg0, ExportImageSavingEventArgs arg1) throws Exception {
		arg1.setKeepImageStreamOpen(false);
		System.out.println(arg1.getImageFileName());
		//arg1.setImageFileName("xxaq1111.jpg");
	}
}
