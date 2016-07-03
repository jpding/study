package com.succez.amap;

import java.io.InputStream;

import com.succez.commons.jdbc.ConnectionFactory;
import com.succez.commons.jdbc.impl.ConnectionFactoryImpl;
import com.succez.commons.util.Properties;

public class ConnPoolUtils {
	private static ConnectionFactory fct ;
	
	static {
		try{
			initConnectionFactory();
		}catch(Exception ex){
			ex.printStackTrace();
		}
	}
	
	public static ConnectionFactory getConnFactory(){
		return fct;
	}
	
	public static void initConnectionFactory() throws Exception {
		InputStream in = ConnPoolUtils.class.getResourceAsStream("jdbc-ora.conf");
		try{
			Properties props = new Properties();
			props.loadUTF8(in);
			fct = new ConnectionFactoryImpl(props);
		}finally{
			in.close();
		}
	}
}
