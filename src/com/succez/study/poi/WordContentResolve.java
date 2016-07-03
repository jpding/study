package com.succez.study.poi;

import com.aspose.words.Body;
import com.aspose.words.Document;
import com.aspose.words.Font;
import com.aspose.words.HtmlFixedSaveOptions;
import com.aspose.words.Node;
import com.aspose.words.Paragraph;
import com.aspose.words.ParagraphCollection;
import com.aspose.words.ParagraphFormat;
import com.aspose.words.Run;
import com.aspose.words.RunCollection;
import com.aspose.words.SaveFormat;
import com.aspose.words.Section;
import com.aspose.words.SectionCollection;
import com.succez.commons.util.StringUtils;

/**
 * http://jira.succez.com/browse/CSTM-1623
 * 
 * 提取word分析报告里面的内容
 * 
 * 
 * <p>Copyright: Copyright (c) 2016</p>
 * <p>succez</p>
 * @author djp
 * @createdate 2016年1月28日
 */
public class WordContentResolve {

	public static void main(String[] args) throws Exception {
		Document doc = WordUtils.getWordDoc("aa.doc");
//		Document nn = getProgDoc(doc);
		doc.save("d:\\aa\\aa.pdf", SaveFormat.PDF);
//		HtmlFixedSaveOptions options = new HtmlFixedSaveOptions();
//		options.setExportEmbeddedCss(true);
//		options.setExportEmbeddedFonts(true);
//		options.setExportEmbeddedImages(true);
//		options.setExportEmbeddedSvg(true);
//		nn.save("d:\\aa\\aa.html", options);
//		SectionCollection secc = doc.getSections();
//		boolean intoProg = false;
//		for (int i = 0; i < secc.getCount(); i++) {
//			Section sec = secc.get(i);
//			Body body = sec.getBody();
//			ParagraphCollection paras = body.getParagraphs();
//			for (int j = 0; j < paras.getCount(); j++) {
//				Paragraph para = paras.get(j);
//				String text = para.getText();
//				ParagraphFormat format = para.getParagraphFormat();
//				String stlName = format.getStyleName();
//				if(intoProg && StringUtils.indexOf(stlName, "标题") >= 0){
//					break;
//				}
//				
//				if(StringUtils.indexOf(stlName, "标题") >= 0 && StringUtils.indexOf(text, "审计查出的问题及处理意见") >= 0){
//					intoProg = true;
//				}
//				if(intoProg){
//					System.out.println(text);
//				}
//			}
//		}
	}
	
	/**
	 * 提取问题文档内容
	 * @param doc
	 * @return
	 */
	public static Document getProgDoc(Document doc) throws Exception {
		SectionCollection secc = doc.getSections();
		boolean intoProg = false;
		Document result = new Document();
		result.removeAllChildren();
		
		Section section = new Section(result);
		result.appendChild(section);
		Body nBody = new Body(result);
		section.appendChild(nBody);
		
		for (int i = 1; i < secc.getCount(); i++) {
			Section sec = secc.get(i);
			Body body = sec.getBody();
			ParagraphCollection paras = body.getParagraphs();
			for (int j = 0; j < paras.getCount(); j++) {
				Paragraph para = paras.get(j);
				String text = para.getText();
				ParagraphFormat format = para.getParagraphFormat();
				String stlName = format.getStyleName();
				if(intoProg && StringUtils.indexOf(stlName, "标题") >= 0){
					break;
				}
				
				if(StringUtils.indexOf(stlName, "标题") >= 0 && findProg(text)){
					intoProg = true;
				}
				if(intoProg){
					int outlineLevel = format.getOutlineLevel();
					if(outlineLevel == 9 && !filterPara(text)){
						continue;
					}
					System.out.print(para.getParagraphBreakFont().getSize());
					System.out.print("\t");
					Node newNode = result.importNode(para, true);
					Node tt = nBody.appendChild(newNode);
					((Paragraph)tt).getParagraphBreakFont().setSize(16);
					System.out.print(((Paragraph)tt).getParagraphBreakFont().getSize());
					System.out.print("\t");
					System.out.println(text);
				}
			}
		}
		return result;
	}
	
	private static boolean filterPara(String text){
		return text.startsWith("上述行为") || text.startsWith("依据") || text.startsWith("根据");
	}
	
	private static boolean findProg(String text){
		int [] idxs = new int[KEY_WORD.length];
		for (int i = 0; i < KEY_WORD.length; i++) {
			int idx = StringUtils.indexOf(text, KEY_WORD[i]);
			idxs[i] = idx;
			if(idx == -1){
				return false;
			}
		}
		return idxs[0]<=idxs[1] && idxs[0]<=idxs[2]; 
	}
	
	private static String [] KEY_WORD = {"审计", "问题", "处理意见"};
}
