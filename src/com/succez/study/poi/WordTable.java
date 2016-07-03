package com.succez.study.poi;

import java.io.InputStream;
import java.sql.ResultSet;

import javax.sql.rowset.RowSetMetaDataImpl;

import com.aspose.words.DataTable;
import com.aspose.words.Document;
import com.sun.rowset.CachedRowSetImpl;

public class WordTable {
	//ExStart
	//ExId:NestedMailMerge
	//ExSummary:Shows how to generate an invoice using nested mail merge regions.
	public static void main(String[] args) throws Exception {
		// The path to the documents directory.

//		// Create the dataset which will hold each DataTable used for mail merge.
//		DataSet pizzaDs = new DataSet();
//
//		pizzaDs.getTables().add(orders);
//		pizzaDs.getTables().add(itemDetails);
		
		InputStream in = WordTable.class.getResourceAsStream("领导批示内容查询.docx");
		Document doc = new Document(in);
		try{
			String [] col = {"ItemName", "ItemTitle", "ItemContent"};
			String [][] datas = new String[2][];
			datas[0] = new String[]{"1", "2", "3"};
			datas[1] = new String[]{"a", "b", "c"};
			DataTable table = createDataTable("Items", col, datas);
			doc.getMailMerge().executeWithRegions(table);
			doc.save("e:\\aaa.doc");
		}finally{
			in.close();
		}

		
	}

	
	public static DataTable createDataTable(String tableName, String [] columns, String [][] values) throws Exception {
		ResultSet rs = makeResultSet(columns, values);
		return new DataTable(rs, tableName);
	}

	public static ResultSet makeResultSet(String[] columns, String[][] values) throws Exception {
		ResultSet rs = createCachedRowSet(columns);
		for(int i=0; i<values.length; i++){
			String [] row = values[i];
			addRow(rs, row);
		}
		return rs;
	}

	private static ResultSet createCachedRowSet(String[] columnNames) throws Exception {
		RowSetMetaDataImpl metaData = new RowSetMetaDataImpl();
		metaData.setColumnCount(columnNames.length);
		for (int i = 0; i < columnNames.length; i++) {
			metaData.setColumnName(i + 1, columnNames[i]);
			metaData.setColumnType(i + 1, java.sql.Types.VARCHAR);
		}

		CachedRowSetImpl rowSet = new CachedRowSetImpl();
		rowSet.setMetaData(metaData);

		return rowSet;
	}

	/**
	 * A helper method that adds a new row with the specified values to a disconnected ResultSet.
	 */
	private static void addRow(ResultSet resultSet, String[] values) throws Exception {
		resultSet.moveToInsertRow();

		for (int i = 0; i < values.length; i++)
			resultSet.updateString(i + 1, values[i]);
		resultSet.insertRow();

		resultSet.moveToCurrentRow();
		resultSet.last();
	}
}
