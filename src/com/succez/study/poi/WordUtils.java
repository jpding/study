package com.succez.study.poi;

import java.io.InputStream;

import com.aspose.words.Document;
import com.succez.bi.activedoc.impl.aspose.AsposeUtil;

public class WordUtils {
	static {
		AsposeUtil.licence();
	}
	
	/**
	 * 
	 * @return
	 */
	public static Document getWordDoc(String name) throws Exception {
		InputStream in = getFileInputStream(name);
		try{
			return new Document(in);
		}finally{
			in.close();
		}
	}
	
	public static InputStream getFileInputStream(String name){
		return WordUtils.class.getResourceAsStream(name);
	}
}
