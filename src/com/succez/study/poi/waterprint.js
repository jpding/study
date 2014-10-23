var Document = com.aspose.words.Document;
var HeaderFooter= com.aspose.words.HeaderFooter;
var HeaderFooterType= com.aspose.words.HeaderFooterType;
var HorizontalAlignment= com.aspose.words.HorizontalAlignment;
var Paragraph= com.aspose.words.Paragraph;
var RelativeHorizontalPosition= com.aspose.words.RelativeHorizontalPosition;
var RelativeVerticalPosition= com.aspose.words.RelativeVerticalPosition;
var Section= com.aspose.words.Section;
var SectionCollection= com.aspose.words.SectionCollection;
var Shape= com.aspose.words.Shape;
var ShapeType= com.aspose.words.ShapeType;
var VerticalAlignment= com.aspose.words.VerticalAlignment;
var WrapType= com.aspose.words.WrapType;

function main(args){
}

function execute(req, res){
}

/**
 * 往word里面插入图片水印
 * @param {} docIn
 * @param {} imgIn
 * @return {}
 */
function insertIntoWatermark(docIn, imgIn){
	var doc = new Document(docIn);
	var watermarkPara = new Paragraph(doc);
	
	var shape = createWatermark(doc, imgIn);
	watermarkPara.appendChild(shape);
	var sections = doc.getSections();
	for (var i = 0; i < sections.getCount(); i++) {
		var sect = sections.get(i);
		insertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_PRIMARY);
		insertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_FIRST);
		insertWatermarkIntoHeader(watermarkPara, sect, HeaderFooterType.HEADER_EVEN);
	}
	return doc;
}

/**
 * 创建word水印控件，在这里调整水印的大小位置等
 * @param {} doc
 * @param {} imgIn
 * @return {}
 */
function createWatermark(doc, imgIn) {
	var shape = new Shape(doc, ShapeType.IMAGE);
	shape.getImageData().setImage(imgfn);
	shape.setWrapType(WrapType.NONE);
	shape.setBehindText(true);
	
	shape.setWidth(500);
	shape.setHeight(500);
	shape.setRelativeHorizontalPosition(RelativeHorizontalPosition.PAGE);
	shape.setHorizontalAlignment(HorizontalAlignment.CENTER);
	shape.setRelativeVerticalPosition(RelativeVerticalPosition.PAGE);
	shape.setVerticalAlignment(VerticalAlignment.CENTER);
	return shape;
}

/**
 * 把水印插入到word的各个章节里面
 * @param {} watermarkPara
 * @param {} sect
 * @param {} headerType
 */
function insertWatermarkIntoHeader(watermarkPara, sect, headerType){
	var header = sect.getHeadersFooters().getByHeaderFooterType(headerType);

	if (header == null) {
		header = new HeaderFooter(sect.getDocument(), headerType);
		sect.getHeadersFooters().add(header);
	}
	header.appendChild(watermarkPara.deepClone(true));
}