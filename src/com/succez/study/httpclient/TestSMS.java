package com.succez.study.httpclient;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;

public class TestSMS {
	
	private static HttpClient client = new HttpClient();
	private static String url = "http://59.173.86.52:8081/sms/MessageSendServlet.do?phone=18602710153&text=%B8%80%E9%A1%B9%%9C%80%E8%A6%81%E5%A4%84%E7%90%86%E3%80%82&st=";

	public static void main(String[] args) throws Exception {
		testSms();
	}

	public static void testSms() throws Exception {
		GetMethod mth = new GetMethod(url);
		mth.getParams().setContentCharset("gbk");
		int satuts = client.executeMethod(mth);
		System.out.println(satuts);
		String rs = mth.getResponseBodyAsString();
		System.out.println(rs);
	}
}
