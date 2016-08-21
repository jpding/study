package com.succez;

import java.util.ArrayList;

import org.apache.http.HeaderElement;
import org.apache.http.HeaderElementIterator;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.conn.ConnectionKeepAliveStrategy;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicHeaderElementIterator;
import org.apache.http.protocol.HTTP;
import org.apache.http.protocol.HttpContext;

public class HttpTest2 {
	
	public static PoolingHttpClientConnectionManager  cfg = new PoolingHttpClientConnectionManager ();
	
	static {
		cfg.setMaxTotal(200);
		cfg.setDefaultMaxPerRoute(200);
	}
	
	
	public static ConnectionKeepAliveStrategy myStrategy = new ConnectionKeepAliveStrategy() {
	    public long getKeepAliveDuration(HttpResponse response, HttpContext context) {
	        // Honor 'keep-a live' header
	        HeaderElementIterator it = new BasicHeaderElementIterator(
	                response.headerIterator(HTTP.CONN_KEEP_ALIVE));
	        while (it.hasNext()) {
	            HeaderElement he = it.nextElement();
	            String param = he.getName();
	            String value = he.getValue();
	            if (value != null && param.equalsIgnoreCase("timeout")) {
	                try {
	                    return Long.parseLong(value) * 1000;
	                } catch(NumberFormatException ignore) {
	                }
	            }
	        }
	        HttpHost target = (HttpHost) context.getAttribute(
	                HttpClientContext.HTTP_TARGET_HOST);
//	        if ("www.naughty-server.com".equalsIgnoreCase(target.getHostName())) {
//	            // Keep alive for 5 seconds only
//	            return 5 * 1000;
//	        } else {
	            // otherwise keep alive for 30 seconds
	            return 30 * 1000;
//	        }
	    }
	};

	
	public static HttpClient httpclient1 = HttpClients.custom().setKeepAliveStrategy(myStrategy).setConnectionManager(cfg).build();
	
	
	
	public static void main(String[] args) throws Exception {
		long s = System.currentTimeMillis();
		test100();
		long e = System.currentTimeMillis();
		System.out.println(e-s);
	}
	
	
	public static void test1002() throws Exception  {
//		ArrayList <Thread> dd = new ArrayList<Thread> ();
//		for(int i=0; i<100; i++){
//			Thread t = new Thread(new S2endInfo1());
//			dd.add(t);
//			t.start();
//		}
//		
//		for(int i=0; i<dd.size(); i++){
//			dd.get(i).join();
//		}
	}
	
	public static void test100() throws Exception {
//		ArrayList <Thread> dd = new ArrayList<Thread> ();
//		for(int i=0; i<100; i++){
//			Thread t = new Thread(new S2endInfo());
//			dd.add(t);
//			t.start();
//		}
//		
//		for(int i=0; i<dd.size(); i++){
//			dd.get(i).join();
//		}
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

//class S2endInfo implements Runnable {
//
//	@Override
//	public void run() {
//		String info = null;
//		try{
//			HttpClient httpclient = new HttpClient();
//			PostMethod post = new PostMethod("http://zx.ums86.com:8899/sms/Api/Send.do");//
//			post.setRequestHeader("connection", "Keep-Alive");
//			post.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET,"gbk");
//			post.addParameter("SpCode", "214680");
//			post.addParameter("LoginName", "hb_gsj");
//			post.addParameter("Password", "gsj2014");
//			post.addParameter("MessageContent", "您登录信用信息共享平台的手机验证码为132856请在2分钟内填写,信用信息共享平台。");
//			post.addParameter("UserNumber", "18602710153");
//			post.addParameter("SerialNumber", "");
//			post.addParameter("ScheduleTime", "");
//			post.addParameter("ExtendAccessNum", "");
//			post.addParameter("f", "1");
//			httpclient.executeMethod(post);
//			info = new String(post.getResponseBody(),"gbk");
//			System.out.println(info);
//			post.releaseConnection();
//		}catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//}
//
//class S2endInfo1 implements Runnable {
//
//	@Override
//	public void run() {
//		String info = null;
//		try{
//			HttpClient httpclient = HttpTest2.httpclient1;
//			PostMethod post = new PostMethod("http://zx.ums86.com:8899/sms/Api/Send.do");//
//			post.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET,"gbk");
//			post.addParameter("SpCode", "214680");
//			post.addParameter("LoginName", "hb_gsj");
//			post.addParameter("Password", "gsj2014");
//			post.addParameter("MessageContent", "您登录信用信息共享平台的手机验证码为132856请在2分钟内填写,信用信息共享平台。");
//			post.addParameter("UserNumber", "18602710153");
//			post.addParameter("SerialNumber", "");
//			post.addParameter("ScheduleTime", "");
//			post.addParameter("ExtendAccessNum", "");
//			post.addParameter("f", "1");
//			httpclient.executeMethod(post);
//			info = new String(post.getResponseBody(),"gbk");
//			System.out.println(info);
//			post.releaseConnection();
//		}catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//}
