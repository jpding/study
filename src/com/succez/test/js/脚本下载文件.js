function main(args){
	var file = new java.io.File("/data/workdir/it/backup/repo20140725020007.zip");
	var ins = new java.io.FileInputStream(file);
	try{
		println(ins.available());
	}finally{
		ins.close();
	}
}

function execute(req, res){
	download(req,res);
}

function download(req, res){
	res.reset();
	res.setContentType("bin");
	res.addHeader("Content-Disposition","attachment;filename=xxx.zip");
	var ins = new java.io.BufferedInputStream(new java.io.FileInputStream("/data/workdir/it/backup/repo20140725020007.zip"));
	
	var buf = new java.io.BufferedOutputStream(res.getOutputStream());
	org.apache.commons.io.IOUtils.copy(ins,buf);
	buf.flush();
	ins.close();
	buf.close();
}