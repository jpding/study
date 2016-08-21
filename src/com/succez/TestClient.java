package com.succez;

import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

import org.apache.cxf.helpers.IOUtils;

import com.succez.commons.util.UtilConst;

public class TestClient {

	public static void main(String[] args) throws Exception {
		
		URL url = new URL("http://192.0.99.110/succezbi/meta/tjfwl/others/test/test.action");
		URLConnection conn = url.openConnection();
		conn.setRequestProperty("Cookie", "JSESSIONID=3669E5E981D38B6B2952AC8A63158AE7");
		InputStream in = conn.getInputStream();
		try{
			System.out.println(IOUtils.toString(in, UtilConst.UTF8));
		}finally{
			in.close();
		}
	}

}
