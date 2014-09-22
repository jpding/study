package com.succez.test.encode;

import java.net.URLDecoder;

import org.springframework.web.util.HtmlUtils;
import org.springframework.web.util.JavaScriptUtils;

import com.succez.commons.util.StringEscapeUtils;

public class Ecode {
	public static void main(String [] args){
		System.out.println(JavaScriptUtils.javaScriptEscape("合同步骤表"));
		System.out.println(HtmlUtils.htmlEscape("合同步骤表"));
		System.out.println(StringEscapeUtils.escapeJavaScript("合同步骤表"));
		System.out.println("%u5408%u540C%u6B65%u9AA4%u8868");
		String ss = "\u5408\u540C\u6B65\u9AA4\u8868";
		System.out.println(StringEscapeUtils.unescapeJavaScript(ss));
		
	    String xx = "%E5%90%88%E5%90%8C%E6%AD%A5%E9%AA%A4%E8%A1%A8";
	    System.out.println("xx"+URLDecoder.decode(xx));
	    System.out.println("xx"+URLDecoder.decode(xx));
	}
}
