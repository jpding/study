package com.succez.amap;

import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.succez.commons.util.UtilConst;
import com.succez.commons.util.io.CSVReader;
import com.succez.commons.util.io.CSVWriter;

public class TestNetAnt {	
	
	private NetAntUtil netUtil = new NetAntUtil();	
	
	private CSVWriter allWriter;
	
	TestNetAnt() throws Exception{
		allWriter = new CSVWriter(new BufferedWriter(new OutputStreamWriter(new FileOutputStream("d:\\ee.txt"), UtilConst.UTF8)));
	}
	
	

	public static void main(String[] args) throws Exception {
		NetAntUtil netUtil = new NetAntUtil();		
		String paramStr = "?keywords=香港映象&city=武汉&citylimit=true&extensions=all";
		String json= netUtil.query(paramStr);
		System.out.println("=====");
		System.out.println(json);
		System.out.println("=====");
		List<Information> infs= netUtil.readJson2Obect(json);
		for(Information inf:infs){
			System.out.println(inf);			
		}
//		long s = System.currentTimeMillis();
//		TestNetAnt testNetAnt = new TestNetAnt();
//		testNetAnt.fillAddress();
//		testNetAnt.closeAddressCsv();
//		long e = System.currentTimeMillis();
//		System.out.println("耗时："+(e-s)/1000);
	}
	
	public void fillAddress() throws Exception {
		List<FW> fws = getAllFws();
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("d:\\cc.txt"), UtilConst.UTF8));
		try{
			CSVWriter csv = new CSVWriter(writer);
			boolean isflush = false;
			for (int i = 0; i < fws.size(); i++) {
				FW fw = fws.get(i);
				List<Information> adss = netUtil.queryAddress(fw.getAddress());
				writeAllAddress(fw, adss);
				isflush = false;
				csv.writeLine(new Object[]{fw.getUUID(), fw.getAddress()});
				if(i % 10 == 0){
					System.out.println(i);
					csv.flush();
					allWriter.flush();
					isflush = true;
				}
			}
			if(!isflush){
				csv.flush();
				allWriter.flush();
			}
			csv.close();
		}finally{
			writer.close();
		}
	}
	
	public void readCsv(){
		//BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("d:\\cc.txt"), UtilConst.UTF8));
		//CSVReader reader = new CSVReader(reader);
	}
	
	private void writeAllAddress(FW fw, List<Information> adss){
		Object [] objs = new Object[9];
		int i=0;
		objs[i++] = fw.getUUID();
		if(adss == null || adss.size() == 0){
			allWriter.writeLine(objs);
		}
		
		for(int j=0; j<adss.size(); j++){
			i=1;
			Information add = adss.get(j);
			objs[i++] = add.getId();	
			objs[i++] = add.getName();
			objs[i++] = add.getTypeCode();
			objs[i++] = add.getGridCode();
			objs[i++] = add.getAdcode();
			objs[i++] = add.getLocation();
			objs[i++] = add.getBusiness_area();
			objs[i++] = add.getAddress();
			allWriter.writeLine(objs);
		}
	}
	
	public void closeAddressCsv(){
		allWriter.close();
	}
	
	public List<FW> getAllFws() throws Exception {
		ArrayList<FW> fws = new ArrayList<FW>(10000);
		
		Connection conn = ConnPoolUtils.getConnFactory().getConnection();
		try{
			Statement stmt = conn.createStatement();
			try{
				String sql = "Select Id, address From f_address t Where Id  Not In (Select uuid From t_1)";
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
}


class FW {
	private String uuid;
	private String address;
	private String gridcode;
	private String location;
	
	public FW(String uuid, String address, String gridcode, String location){
		this.uuid = uuid;
		this.address = address;
		this.gridcode = gridcode;
		this.location = location;
	}
	
	public String getUUID(){
		return uuid;
	}
	
	public String getGridCode(){
		return gridcode;
	}
	
	public String getLocation(){
		return location;
	}
	
	public String getAddress(){
		return address;
	}
}