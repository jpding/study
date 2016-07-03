package com.succez;

import java.awt.FlowLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;

public class GainAllIp extends JFrame{
    public GainAllIp(){
 
        panel.setLayout(new FlowLayout());
        panel.add(showButton);
        panel.add(closeButton);
 
        JScrollPane js = new JScrollPane(textArea,
                JScrollPane.VERTICAL_SCROLLBAR_ALWAYS,
                JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
 
        panel.add(js);
        add(panel);
 
        showButton.addActionListener(new ActionListener(){
            @Override
            public void actionPerformed(ActionEvent e){
                try{
                    gainAllIp();
                }catch(UnknownHostException e1){
                    e1.printStackTrace();
                }
            }
        });
        closeButton.addActionListener(new ActionListener(){
            @Override
            public void actionPerformed(ActionEvent e){
                System.exit(0);
            }
        });
        setSize(300, 300);
        setVisible(true);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
 
    /**
     * 获取内网所有IP，并显示在文本域中
     *
     * @throws UnknownHostException
     * */
    public void gainAllIp() throws UnknownHostException{
        InetAddress host = InetAddress.getLocalHost();
        String hostAddress = host.getHostAddress();
        int pos = hostAddress.lastIndexOf(".");
        String wd = hostAddress.substring(0, pos + 1);
        for(int i = 1; i <= 255; ++i){
            String ip = wd + i;
            thread = new PingIpThread(ip);
            new Thread(thread).start();
        }
    }
 
    /**
     * 内部线程类 用于Ping指定的Ip地址，并判断其是否为有效的内网Ip地址，如果是就添加在集合对象中
     * */
    class PingIpThread implements Runnable{
        public PingIpThread(){
 
        }
 
        public PingIpThread(String ip){
            this.ip = ip;
        }
 
        private String ip;
 
        @Override
        public void run(){
            try{
                // 获取所ping的IP进程
                Process pro = Runtime.getRuntime().exec(
                        "ping " + ip + " -w 280 -n 1");
                BufferedReader buf = new BufferedReader(new InputStreamReader(
                        pro.getInputStream()));
                String line = buf.readLine();
                while(line != null){
                    if(line != null && (!line.equals(""))){
                        if(line.substring(0, 2).equals("来自")
                                || (line.length() > 10 && line.substring(0, 10)
                                        .equals("Reply from"))){
                            textArea.append(ip + "\n");
                            System.out.println(ip);
                        }
                    }
                    line = buf.readLine();
                }
            }catch(Exception e){
                e.printStackTrace();
            }
 
        }
    }// end inner class
 
    public static void main(String[] args){
        new GainAllIp();
    }
 
    JPanel panel = new JPanel();
    JButton showButton = new JButton("显示所有内网IP");
    JButton closeButton = new JButton("退出程序");
    JTextArea textArea = new JTextArea(15, 20);
    Map<String, String> pingmap = new HashMap<String, String>();
    PingIpThread thread = null;
}