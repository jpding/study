package com.succez;

import java.util.ArrayList;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;

public class HttpTest {
	
	public static MultiThreadedHttpConnectionManager cfg = new MultiThreadedHttpConnectionManager();
	
	public static HttpClient httpclient1 = new HttpClient(cfg);
	
	static {
		cfg.getParams().setDefaultMaxConnectionsPerHost(2);
		cfg.getParams().setMaxTotalConnections(1);
	}
	
	public static void main(String[] args) throws Exception {
		long s = System.currentTimeMillis();
//		test1002();
		test2();
		long e = System.currentTimeMillis();
		System.out.println(e-s);
	}
	
	
	public static void test1002() throws Exception  {
		ArrayList <Thread> dd = new ArrayList<Thread> ();
		for(int i=0; i<100; i++){
			Thread t = new Thread(new SendInfo1());
			dd.add(t);
			t.start();
		}
		
		for(int i=0; i<dd.size(); i++){
			dd.get(i).join();
		}
	}
	
	public static void test100() throws Exception {
		ArrayList <Thread> dd = new ArrayList<Thread> ();
		for(int i=0; i<100; i++){
			Thread t = new Thread(new SendInfo());
			dd.add(t);
			t.start();
		}
		
		for(int i=0; i<dd.size(); i++){
			dd.get(i).join();
		}
	}
	
	public static void test2() throws Exception {
		String info = null;
		try{
			HttpClient httpclient = new HttpClient();
			PostMethod post = new PostMethod("http://zx.ums86.com:8899/sms/Api/Send.do");//
			post.setRequestHeader("connection", "Keep-Alive");
			post.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET,"gbk");
			post.addParameter("SpCode", "214680");
			post.addParameter("LoginName", "hb_gsj");
			post.addParameter("Password", "gsj2014");
			post.addParameter("MessageContent", "您登录信用信息共享平台的手机验证码为1234请在2分钟内填写,信用信息共享平台。");
			post.addParameter("UserNumber", "18602710153");
			post.addParameter("SerialNumber", "");
			post.addParameter("ScheduleTime", "");
			post.addParameter("ExtendAccessNum", "");
			post.addParameter("f", "1");
			httpclient.executeMethod(post);
			info = new String(post.getResponseBody(),"gbk");
			System.out.println(info);
		}catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	public static String getByteString( byte[] buff_out )
	{
		StringBuffer strBuf = new StringBuffer(buff_out.length * 3);
		strBuf.append("Length[");
		strBuf.append(buff_out.length);
		strBuf.append("];Content[");
		for ( int i = 0 ; i < buff_out.length ; ++i ) {
			int l = buff_out[i] & 0x0F;
			int h = (buff_out[i] & 0xF0) >> 4;

			char ll = (char) (l > 9 ? 'a' + l - 10 : '0' + l);
			char hh = (char) (h > 9 ? 'a' + h - 10 : '0' + h);

			strBuf.append(hh);
			strBuf.append(ll);
			strBuf.append(" ");
		}
		strBuf.append("]");
		return strBuf.toString().toUpperCase();
	}
}

class SendInfo implements Runnable {

	@Override
	public void run() {
		String info = null;
		try{
			HttpClient httpclient = new HttpClient();
			PostMethod post = new PostMethod("http://zx.ums86.com:8899/sms/Api/Send.do");//
			post.setRequestHeader("connection", "Keep-Alive");
			post.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET,"gbk");
			post.addParameter("SpCode", "214680");
			post.addParameter("LoginName", "hb_gsj");
			post.addParameter("Password", "gsj2014");
			post.addParameter("MessageContent", "您登录信用信息共享平台的手机验证码为132856请在2分钟内填写,信用信息共享平台。");
			post.addParameter("UserNumber", "18602710153");
			post.addParameter("SerialNumber", "");
			post.addParameter("ScheduleTime", "");
			post.addParameter("ExtendAccessNum", "");
			post.addParameter("f", "1");
			httpclient.executeMethod(post);
			info = new String(post.getResponseBody(),"gbk");
			System.out.println(info);
			post.releaseConnection();
		}catch (Exception e) {
			e.printStackTrace();
		}
	}
}

class SendInfo1 implements Runnable {

	@Override
	public void run() {
		String info = null;
		try{
			HttpClient httpclient = HttpTest.httpclient1;
			PostMethod post = new PostMethod("http://zx.ums86.com:8899/sms/Api/Send.do");//
			post.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET,"gbk");
			post.addParameter("SpCode", "214680");
			post.addParameter("LoginName", "hb_gsj");
			post.addParameter("Password", "gsj2014");
			post.addParameter("MessageContent", "您登录信用信息共享平台的手机验证码为132856请在2分钟内填写,信用信息共享平台。");
			post.addParameter("UserNumber", "18602710153");
			post.addParameter("SerialNumber", "");
			post.addParameter("ScheduleTime", "");
			post.addParameter("ExtendAccessNum", "");
			post.addParameter("f", "1");
			httpclient.executeMethod(post);
			info = new String(post.getResponseBody(),"gbk");
			System.out.println(info);
			post.releaseConnection();
		}catch (Exception e) {
			e.printStackTrace();
		}
	}
}
