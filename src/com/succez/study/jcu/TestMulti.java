package com.succez.study.jcu;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

import org.apache.commons.io.IOUtils;

import com.succez.commons.jdbc.ConnectionFactory;
import com.succez.commons.jdbc.JdbcSetting;
import com.succez.commons.jdbc.impl.ConnectionFactoryImpl;
import com.succez.commons.util.Properties;

public class TestMulti {

//	private static String url = "jdbc:vertica://10.48.43.215:5433/vtc?ConnectionLoadBalance=true&EnableRoutableQueries=true";
//	private static String url = "jdbc:vertica://10.48.43.215:5433/vtc?ConnectionLoadBalance=true";

//	private static String url = "jdbc:vertica://192.0.99.46:5433/vetc?ConnectionLoadBalance=true";
	
	private static String url = "jdbc:vertica://vertica02.succez.com:5433/vetc?ConnectionLoadBalance=true&EnableRoutableQueries=true";
	
	private static String user = "dbadmin";

	private static String password = "dbadmin";

	private static String driver = "com.vertica.jdbc.Driver";
	
	public static ArrayList <Long>result = new ArrayList<Long>();
	
//	private static String url = "jdbc:oracle:thin:@10.48.43.39:1521:orcl";
//
//	private static String user = "sdgsbi";
//
//	private static String password = "succezbi123";
//
//	private static String driver = "oracle.jdbc.driver.OracleDriver";

	private static ConnectionFactory fct;

	static {
		Properties prop = new Properties();
		prop.setString(JdbcSetting.URL, url);
		prop.setString(JdbcSetting.USER, user);
		prop.setString(JdbcSetting.PASSWORD, password);
		prop.setString(JdbcSetting.DRIVER, driver);
		prop.setInt(JdbcSetting.POOL_SIZE, 50);
		
		fct = new ConnectionFactoryImpl(prop);
		
//		com.vertica.jdbc.DataSource jdbcSettings = new com.vertica.jdbc.DataSource();
//		jdbcSettings.setDatabase("dbname");
//		jdbcSettings.setHost("ipaddress");
//		jdbcSettings.setUserID("username");
//		jdbcSettings.setPassword("password");
//		jdbcSettings.setEnableRoutableQueries(true);
////
//		VerticaRoutableConnection conn = (VerticaRoutableConnection) 
//		jdbcSettings.getConnection();
		
	}
	
	

	public static void main(String[] args) throws Exception {
		int count = 50;

		ArrayList<Thread> list = new ArrayList<Thread> ();
		String sql = getSQL();
		
		for (int i = 0; i < count; i++) {
			RunSQL target = new RunSQL(fct, sql, i);
			Thread t = new Thread(target);
			list.add(t);
			t.start();
		}
		
		for (int i = 0; i < list.size(); i++) {
			list.get(i).join();
		}
		
		int sum = 0;
		for (int i = 0; i < result.size(); i++) {
			sum += result.get(i);
		}
		
		System.out.println("平均："+sum/result.size());
		
		fct.close();
	}
	
	private static String getSQL() throws Exception {
		InputStream in = TestMulti.class.getResourceAsStream("jsgs.txt");
		try{
			return IOUtils.toString(in, "utf-8");
		}finally{
			in.close();
		}
	}
}

class RunSQL implements Runnable {
	private String sql;
	private int xh;
	private ConnectionFactory fct;
	
	RunSQL(ConnectionFactory fct, String sql, int xh) {
		this.sql = sql;
		this.xh = xh;
		this.fct = fct;
	}

	@Override
	public void run() {
		try {
			Connection conn = fct.getConnection();
			try {
				Statement stmt = conn.createStatement();
				try{
					long s = System.currentTimeMillis();
					ResultSet rs = stmt.executeQuery(sql);
					long e = System.currentTimeMillis();
					long ll = (e-s)/1000;
					TestMulti.result.add(ll);
					rs.next();
					System.out.println("线程"+xh+":"+ll+"s;" +rs.getString(1));
					rs.close();
				}finally{
					stmt.close();
				}
			}
			finally {
				conn.close();
			}
		}
		catch (Exception ex) {
			ex.printStackTrace();
		}
	}
	
//	public void run1() {
//		try {
//			VerticaRoutableConnection conn = (VerticaRoutableConnection)fct.getConnection();
//			try {
//				conn.createRoutableExecutor(arg0, arg1)
//				try{
//					long s = System.currentTimeMillis();
//					stmt.executeQuery(sql);
//					long e = System.currentTimeMillis();
//					System.out.println("线程"+xh+":"+(e-s)/1000+"s");
//				}finally{
//					stmt.close();
//				}
//			}
//			finally {
//				conn.close();
//			}
//		}
//		catch (Exception ex) {
//			ex.printStackTrace();
//		}
//	}
}
