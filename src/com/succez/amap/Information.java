package com.succez.amap;
/**
 * 信息实体类
 * <p>Copyright: Copyright (c) 2016</p>
 * <p>succez</p>
 * @author John
 * @createdate 2016年6月16日
 */
public class Information {

	private String id;//唯一ID

	private String name;//名称

	private String address; //地址

	private String location; //经纬度

	private String citycode; //城市编码

	private String adcode; //区域编码

	private String adname; //区域名称

	private String business_area;//所在商圈
	
	private String gridcode; //地理格ID，同一个大的小区，可能是在一起的
	
	private String typecode; //建筑物类型 

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
	
	public String getCitycode() {
		return citycode;
	}

	public void setCitycode(String citycode) {
		this.citycode = citycode;
	}

	public String getAdcode() {
		return adcode;
	}

	public void setAdcode(String adcode) {
		this.adcode = adcode;
	}

	public String getAdname() {
		return adname;
	}

	public void setAdname(String adname) {
		this.adname = adname;
	}

	public String getBusiness_area() {
		return business_area;
	}

	public void setBusiness_area(String business_area) {
		this.business_area = business_area;
	}
	
	public void setGridcode(String gridcode){
		this.gridcode = gridcode;
	}
	
	public String getGridCode(){
		return this.gridcode;
	}
	
	public void setTypeCode(String typeCode){
		this.typecode = typeCode;
	}
	
	public String getTypeCode(){
		return this.typecode;
	}

	/*@Override
	public String toString() {
		return "Information [id=" + id + ", name=" + name + ", address=" + address + ", location=" + location
				+ ", pcode=" + pcode + ", pname=" + pname + ", citycode=" + citycode + ", cityname=" + cityname
				+ ", adcode=" + adcode + ", adname=" + adname + ", business_area=" + business_area + ", toString()="
				+ super.toString() + "]";
	}*/

}
