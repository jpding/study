package com.succez.amap;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.util.URIUtil;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.succez.commons.util.StringUtils;

public class NetAntUtil {
	
	private HttpClient client;
	
	public NetAntUtil(){
		client = createClient();
	}

	public List<Information>  queryAddress(String address) throws Exception {
		String paramStr = "?keywords="+address+"&city=武汉&citylimit=true&extensions=all";
		String json= query(paramStr);
		if("ERROR".equals(json)){
			Thread.sleep(3000);
			return queryAddress(address);
		}
//		System.out.println("=====");
//		System.out.println(json);
//		System.out.println("=====");
		return this.readJson2Obect(json);
	}
	
	private HttpClient createClient(){
		HttpClient client = new HttpClient();
		client.getHttpConnectionManager().getParams().setSoTimeout(100000);
		client.getHttpConnectionManager().getParams().setConnectionTimeout(100000);
		return client;
	}
	
	/**
	 * 根据关键字查询json信息
	 * @param queryStr
	 * @return
	 * @throws IOException
	 */
	public String query(String queryStr) throws Exception {
		StringBuilder response = new StringBuilder();
		//1639192bc252346fc5011cc0fd0b3b61   企业号码
		queryStr += "&output=JSON&key=1639192bc252346fc5011cc0fd0b3b61";
		//queryStr += "&output=JSON&key=e6921f4489350c87763430a17d5863fd";
		String url = " http://restapi.amap.com/v3/place/text";
		HttpMethod method = new GetMethod(url);
		try{
			try {
				if (StringUtils.isNotBlank(queryStr))
					method.setQueryString(URIUtil.encodeQuery(queryStr));
				Thread.sleep(300);
				client.executeMethod(method);
				if (method.getStatusCode() == HttpStatus.SC_OK) {
					BufferedReader reader = new BufferedReader(new InputStreamReader(method.getResponseBodyAsStream(),
							"utf-8"));
					String line;
					while ((line = reader.readLine()) != null) {
						//System.out.println("line is " + line);
						response.append(line);
					}
					reader.close();
				}
				return response.toString();
			}
			finally {
				method.releaseConnection();
			}
		}catch(Throwable ab){
			ab.printStackTrace();
			client = createClient();
			Thread.sleep(2000);
			return "ERROR";
		}
	}

	/**
	 * 根据json字符串获取对象信息
	 * @param json
	 * @return
	 */
	public List<Information> readJson2Obect(String json) {
		List<Information> infs = new ArrayList<Information>();
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			Map<String, Map<String, Object>> maps = objectMapper.readValue(json, Map.class);
			Set<String> key = maps.keySet();
			Iterator<String> iter = key.iterator();
			while (iter.hasNext()) {
				String field = iter.next();
				if ("pois".equals(field)) {
					ArrayList<Map<String, Object>> list = (ArrayList<Map<String, Object>>) maps.get(field);
					for (Map<String, Object> map : list) {
						Information inf = new Information();
						if (map.containsKey("id"))
							inf.setId(map.get("id").toString());
						if (map.containsKey("name"))
							inf.setName(map.get("name").toString());
						if (map.containsKey("address"))
							inf.setAddress(map.get("address").toString());
						if (map.containsKey("location"))
							inf.setLocation(map.get("location").toString());
						if (map.containsKey("citycode"))
							inf.setCitycode(map.get("citycode").toString());
						if (map.containsKey("adcode"))
							inf.setAdcode(map.get("adcode").toString());
						if (map.containsKey("adname"))
							inf.setAdname(map.get("adname").toString());
						inf.setGridcode(StringUtils.obj2str(map.get("gridcode")));
						inf.setTypeCode(StringUtils.obj2str(map.get("typecode")));
						infs.add(inf);
					}
				}
			}
		}
		catch (JsonParseException e) {
			e.printStackTrace();
		}
		catch (JsonMappingException e) {
			e.printStackTrace();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		return infs;
	}
}
