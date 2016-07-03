--每天全量数据(550万)做缓慢变化，并且中间某一天全量数据插入，实现方式如下：
--源表
-- SRC	currDate,ORG,ID,CORP_STATUS,CORP_CAPTION,CHECK_DATE,.....  
--
--目的表
-- DEST	fromdate,todate,md5key,ORG,ID,CORP_STATUS,CORP_CAPTION,CHECK_DATE,.....
--
1. 源表全量数据(带上当天日期)和目标库数据库对应日期段做比较  fromdate<=currDate & todate>=currDate
2. 把比较后的数据分成三类，新增的数据、变更的数据、没有变化的数据(要做其他字段的更新)。不考虑删除的数据
3. 给源表数据打标记，并把数据存储到临时表中

--TMP1 CURRDATE,ORG,ID,STATUS

SELECT ORG,
			 ID,
			 Case WHEN T1.MD5KEY = T2.MD5KEY THEN
					'1'
				 WHEN T2.MD5KEY IS NULL THEN
					'2'
				 ELSE
					'3'
			 END AS STATUS
	FROM SRC T1
	LEFT JOIN DEST T2 ON T1.ORG = T2.ORG
									 AND T1.ID = T2.ID
									 AND T2.FROMDATE <= CURRDATE
									 AND T2.TODATE >= CURRDATE
4. 插入新数据
    									 
									 