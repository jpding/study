package com.succez.study.jpg;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.resizers.configurations.ScalingMode;

public class CompressPic {
	public static void main(String [] args) throws Exception{
		long l = System.currentTimeMillis();
		Thumbnails.of("e:\\1.JPG").scale(1).outputQuality(0.5).scalingMode(ScalingMode.PROGRESSIVE_BILINEAR).toFile("e:\\3.jpg");
		long e = System.currentTimeMillis();
		System.out.println(e-l);
	}
}
