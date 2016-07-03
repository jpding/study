package com.succez.study.httpclient;

import java.io.File;
import java.io.InputStream;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.HttpClientBuilder;

import com.succez.commons.util.io.IOUtils;

public class TestUploadFile {
	
	public static void main(String [] args) throws Exception{
		testHttpPost();
	}
	
	
	private static void testHttpPost() throws Exception{
		HttpClient httpclient = HttpClientBuilder.create().build();
		HttpPost post = new HttpPost("http://szyyzb.succez.com/succezbi/api/upload?user=admin&password=thisissuccez&taskid=WJT1_8");
//		HttpPost post = new HttpPost("http://127.0.0.1:8080/api/upload?user=admin&password=thisissuccez&taskid=WJT1_8");
		File uploadFile = new File("D:/succezIDE/workspace/studytest/src/com/succez/study/httpclient/dpk-wjt1-8.xml");
		MultipartEntityBuilder entityBuilder = MultipartEntityBuilder.create();
		entityBuilder.addBinaryBody("fileobj", uploadFile);
		
		HttpEntity httpEntity = entityBuilder.build();
		post.setEntity(httpEntity);
		HttpResponse res = httpclient.execute(post);
		int statusCode = res.getStatusLine().getStatusCode();
		if(statusCode == HttpStatus.SC_OK){
			InputStream cc = res.getEntity().getContent();
			try{
				System.out.println(IOUtils.toStringUtf8(cc));
			}finally{
				cc.close();
			}
		}
	}
}
