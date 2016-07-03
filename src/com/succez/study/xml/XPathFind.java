package com.succez.study.xml;

import java.io.InputStream;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.succez.commons.util.ExceptionUtils;
import com.succez.commons.util.io.IOUtils;

public class XPathFind {
	public static void main(String [] args) throws Exception {
		find();
	}
	
	public static void find() throws Exception {
		String content = getContent("dj_nsrxx.xml");
		Document doc = DocumentHelper.parseText(content);
		Element elm = doc.getRootElement();
		List nodes = elm.selectNodes("./group/data");
		for (int i = 0; i < nodes.size(); i++) {
			Element elem = (Element)nodes.get(i);
			System.out.println(elem.attributeValue("name"));
		}
		doc.setXMLEncoding("gbk");
	}
	
	public static String getContent(String name){
		InputStream ins = XPathFind.class.getResourceAsStream("dj_nsrxx.xml");
		try{
			return IOUtils.toStringUtf8(ins);
		}catch(Exception ex){
			ExceptionUtils.rethrowRuntimeException(ex);
		}finally{
			IOUtils.closeQuietly(ins);
		}
		
		return null;
	}
}
