package com.succez.amap;

import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.succez.commons.util.UtilConst;
import com.succez.commons.util.io.CSVWriter;

public class MultiNet {	
	
	private NetAntUtil netUtil = new NetAntUtil();	
	
	private CSVWriter fwWriter;
	private CSVWriter logWirter;
	
	private String logfn;
	private String fwfn;
	private String name;
	
	private List<FW> srcFws;
	
	
	public static void main(String[] args) throws Exception {
//		NetAntUtil netUtil = new NetAntUtil();		
//		String paramStr = "?keywords=古田二路52号&city=武汉&citylimit=true&extensions=all";
//		String json= netUtil.query(paramStr);
//		System.out.println("=====");
//		System.out.println(json);
//		System.out.println("=====");
//		List<Information> infs= netUtil.readJson2Obect(json);
//		for(Information inf:infs){
//			System.out.println(inf);			
//		}
//		long s = System.currentTimeMillis();
//		MultiNet testNetAnt = new MultiNet();
//		testNetAnt.fillAddress();
//		testNetAnt.closeAddressCsv();
//		long e = System.currentTimeMillis();
//		System.out.println("耗时："+(e-s)/1000);
	}
	
	public MultiNet(List<FW> srcFws, String name) throws Exception{
		this.name = name;
		logfn = "D:\\gaode\\"+name+"log.txt";
		fwfn = "D:\\gaode\\"+name+".txt";
		fwWriter  = new CSVWriter(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(logfn), UtilConst.UTF8)));
		logWirter = new CSVWriter(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(fwfn), UtilConst.UTF8)));
		this.srcFws = srcFws;
	}
	
	public void fillAddress() throws Exception {
		boolean isflush = false;
		for (int i = 0; i < srcFws.size(); i++) {
			FW fw = srcFws.get(i);
			List<Information> adss = netUtil.queryAddress(fw.getAddress());
			writeAllAddress(fw, adss);
			isflush = false;
			logWirter.writeLine(new Object[]{fw.getUUID(), fw.getAddress()});
			if(i % 10 == 0){
				System.out.println(name + ":"+i);
				logWirter.flush();
				fwWriter.flush();
				isflush = true;
			}
		}
		if(!isflush){
			logWirter.flush();
			fwWriter.flush();
		}
	}
	
	private void writeAllAddress(FW fw, List<Information> adss){
		Object [] objs = new Object[9];
		int i=0;
		objs[i++] = fw.getUUID();
		if(adss == null || adss.size() == 0){
			fwWriter.writeLine(objs);
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
			fwWriter.writeLine(objs);
		}
	}
	
	public void closeAddressCsv(){
		logWirter.close();
		fwWriter.close();
	}
}