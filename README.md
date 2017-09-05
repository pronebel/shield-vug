
## 理念

- 任何文件都有其该从属的架构及目录
- 通过命令辅助创建文件,并自动进行归类


## 生成新项目

    vug init xxxx  

## 生成mod模块

    vug module xxxx
    
    生成模块后,会更新module的配置文件表
    
## 生成entry入口模块

    创建入口模块
    vug entry xxx
    
    更新入口模块的moules的引用配置
    vug entry xxx --update
    
## 生成独立的文件
    
    vug component filename
    vug directive filename
    vug filter filename
    vug page filename
    vug service filename
    
## 生成style

    初始化基础的style脚手架
    
    vug style xxx/template    






