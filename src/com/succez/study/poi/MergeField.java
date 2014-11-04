package com.succez.study.poi;

import com.aspose.words.Bookmark;
import com.aspose.words.Document;
import com.aspose.words.MailMerge;
import com.aspose.words.ProtectionType;
import com.aspose.words.WriteProtection;

public class MergeField {
	public static void main(String [] args) throws Exception {
		MergeField field = new MergeField();
//		field.updateMergeField();
		field.modifyBookMark();
	}
	
	public void updateMergeField() throws Exception {
		String file = "e:/aa/2.doc";
		Document doc = new Document(file);
		String [] fieldNames = new String[]{"UserName"};
		Object [] fieldValues = new Object[]{"xxxx"};
		MailMerge merge = doc.getMailMerge();
		doc.getMailMerge().execute(fieldNames, fieldValues);
		doc.save("e:/aa/3.doc");
		
	}
	
	public void modifyBookMark() throws Exception{
		String file = "e:/aa/5.doc";
		Document doc = new Document(file);
		Bookmark markbook = doc.getRange().getBookmarks().get("testName1");
		markbook.setText("中国该人民解放军");
		doc.setTrackRevisions(true);
		doc.protect(ProtectionType.ALLOW_ONLY_REVISIONS);
		doc.save("e:/aa/6.doc");
	}
}
