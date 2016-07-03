package com.succez.amap;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class TestMultiNet implements Runnable {
	
	private MultiNet netAnt;
	
	TestMultiNet(MultiNet netAnt){
		this.netAnt = netAnt;
	} 
	
	public static void main(String [] args) throws Exception {
		List<FW> fws = getAllFws();
		
		List<List<FW>> split = new ArrayList<List<FW>>();
		int index = 0;
		while(index<fws.size()){
			split.add(fws.subList(index,Math.min( index+10000, fws.size())));
			index += 10000;
			index = Math.min(index, fws.size());
		}
		
		List<Thread> tt = new ArrayList<Thread>();
		
		long s = System.currentTimeMillis();
		for(int i=0; i<split.size(); i++){
			Thread f2NetAnt = new Thread(new TestMultiNet(new MultiNet(split.get(i), "f"+i)));
			tt.add(f2NetAnt);
			f2NetAnt.start();
		}
		
		for(int i=0; i<tt.size(); i++){
			tt.get(0).join();
		}
		long e = System.currentTimeMillis();
		System.out.println("耗时："+(e-s)/1000);
	}
	
	public static List<FW> getAllFws() throws Exception {
		ArrayList<FW> fws = new ArrayList<FW>(10000);
		
		Connection conn = ConnPoolUtils.getConnFactory().getConnection();
		try{
			Statement stmt = conn.createStatement();
			try{
				String sql = "Select Id, address From f_address_qk t ";
				ResultSet rs = stmt.executeQuery(sql);
				while(rs.next()){
					String uuid = rs.getString(1);
					String address = rs.getString(2);
					fws.add(new FW(uuid, address, null, null));
				}
				rs.close();
			}finally{
				stmt.close();
			}
			return fws;
		}finally{
			conn.close();
		}
	}

	@Override
	public void run() {
		try {
			netAnt.fillAddress();
			netAnt.closeAddressCsv();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
}
