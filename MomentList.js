import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, ImageBackground, ListView } from 'react-native';


const styles = StyleSheet.create({
    container: {

    },
    itemView: {
        paddingLeft: 15,
        paddingRight: 15,
        width: "100%",
        height: "auto",
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "auto",
        justifyContent: "flex-start",
        alignItems: "stretch",
        backgroundColor: "#ffffff"
    },

    bigText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#000000'
    },
    mainText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#000000'
    }
});


export default class MomentList extends Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id != r2.id })
        this.state = {
            dataSource: ds.cloneWithRows([]),
        }
    }

    componentDidMount = () => {
        this.requestData();
    }

    requestData = () => {
        fetch("http://m.test.dance365.com/apis/moment/moments/rec/default?access_token=ee8928fd-3833-46f8-b136-f734f315f927&column=recommend&pageSize=10&pageNum=0")
            .then((response) => response.text())
            .then((json) => {
                let jsonObj = JSON.parse(json);
                let contentArray = jsonObj.content;
                let dataArray = contentArray.map((content) => Object.assign({}, {
                    id: content.creator,
                    avatarUrl: content.creatorBackup.avatar,
                    userName: content.creatorBackup.name,
                    releaseDate: content.onsellTime,
                    title: content.title,
                    coverUrl: content.cover[0],
                    viewCount: content.statisticsBackup.viewCount,
                    likeCount: content.statisticsBackup.praiseCount,
                    commentCount: content.statisticsBackup.commentCount,
                    collectionCount: content.statisticsBackup.favoriteCount
                }));
                this.setState((prev, props) => Object.assign(prev, { dataSource: prev.dataSource.cloneWithRows(dataArray) }))
            })
            .catch((err) => console.log(err))
    }

    getItemView = (data) => {
        return (
            <View style={styles.itemView}>
                <View style={{
                    height: 48,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center"
                }}>
                    <Image borderRadius={100} source={{ uri: data.avatarUrl }} style={{ width: 30, height: 30, marginRight: 6 }} />
                    <Text>{data.userName}</Text>
                    <View style={{ flex: 1 }} />
                    <Text>{data.releaseDate}</Text>
                </View>
                <Text>{data.title}</Text>
                <ImageBackground source={{ uri: data.coverUrl }} borderRadius={10} style={{ width: "100%", height: 194, justifyContent: "flex-end", alignItems: "flex-start" }}>
                    <Image source={require('./img/home_play.png')} style={{ width: 50, height: 50, margin: 10 }} />
                </ImageBackground>
                <View style={{
                    width: "100%",
                    height: 50,
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <Image source={require('./img/view_count.png')} style={{ width: 16, height: 16, marginRight: 6 }} />
                    <Text>{data.viewCount}</Text>
                    <View style={{ flex: 1 }} />
                    <Image source={require('./img/home_love.png')} style={{ width: 16, height: 16, marginRight: 6 }} />
                    <Text style={{ marginRight: 26 }}>{data.likeCount}</Text>
                    <Image source={require('./img/home_comment.png')} style={{ width: 16, height: 16, marginRight: 6 }} />
                    <Text style={{ marginRight: 26 }}>{data.commentCount}</Text>
                    <Image source={require('./img/home_collectio.png')} style={{ width: 16, height: 16, marginRight: 6 }} />
                    <Text style={{ marginRight: 0 }}>{data.collectionCount}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: "#e3e3e3" }} />
            </View>);
    }


    render() {
        return (
            <ListView
                style={{ flex: 1, width: "100%" }}
                dataSource={this.state.dataSource}
                renderRow={this.getItemView}
            />
        );
    }
}