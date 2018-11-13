import React, { Component } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View, Image, ImageBackground, FlatList, Button } from 'react-native';
import HttpUtil from './HttpUtil'

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


export default class MomentFlatList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            showError: false,
            showLoading: true,
            refreshing: false,
            footerState: MomentFlatList.FOOTER_STATE_LOADING_MORE
        }
    }
    requestingData = false;
    pageNum = 0;
    static FOOTER_STATE_LOADING_MORE = 1;
    static FOOTER_STATE_NO_MORE = 2;
    static FOOTER_STATE_NONE = 3;
    static FOOTER_STATE_ERROR = 4;

    componentDidMount = () => {
        this.requestData(this.pageNum);
    }

    requestData = (pageNum = 0) => {
        if (this.requestingData) return;
        this.requestingData = true;
        HttpUtil.fetchWithTimeout(fetch(`http://m.test.dance365.com/apis/moment/moments/rec/default?access_token=ee8928fd-3833-46f8-b136-f734f315f927&column=recommend&pageSize=10&pageNum=${pageNum}`), 2000)
            .then((response) => response.text())
            .then((json) => {
                let jsonObj = JSON.parse(json);
                let contentArray = jsonObj.content;
                let dataArray = contentArray.map((content) => Object.assign({}, {
                    id: content.id,
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
                this.setState((prev, props) => Object.assign(prev, {
                    data: pageNum != 0 ? prev.data.concat(dataArray) : dataArray,
                    footerState: jsonObj.last ? MomentFlatList.FOOTER_STATE_NO_MORE : MomentFlatList.FOOTER_STATE_LOADING_MORE,
                    showLoading: false,
                    refreshing: false
                }))
                this.pageNum = pageNum + 1;
                this.requestingData = false;
            })
            .catch((err) => {
                console.log(err)
                this.setState((prev, props) => Object.assign(prev, {
                    footerState: MomentFlatList.FOOTER_STATE_ERROR,
                    showError: this.pageNum == 0,
                    showLoading: false,
                    refreshing: false
                }))
                this.requestingData = false;
            })
    }

    renderItem = ({ item: data }) => {
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

    pullRefresh = () => {
        if (this.requestingData) return;
        this.pageNum = 0;
        this.setState((prev, pros) => Object.assign(prev, {
            refreshing: true,
            footerState: MomentFlatList.FOOTER_STATE_NONE
        }))
        this.requestData(this.pageNum);
    }

    renderFooter = () => {
        let footer = null;
        switch (this.state.footerState) {
            case MomentFlatList.FOOTER_STATE_LOADING_MORE:
                footer = (
                    <View style={{ backgroundColor: "#ffffff", flexBasis: "auto", flexShrink: 0, flexGrow: 0, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: 10, paddingBottom: 10 }}>
                        <ActivityIndicator
                            animating={true}
                            color="#f93684"
                            size="small"
                            style={{ width: 20, height: 20, marginRight: 5 }}
                        />
                        <Text>加载中...</Text>
                    </View>
                )
                break
            case MomentFlatList.FOOTER_STATE_NO_MORE:
                footer = (
                    <View style={{ backgroundColor: "#ffffff", flexBasis: "auto", flexShrink: 0, flexGrow: 0, flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: 10, paddingBottom: 10 }}>
                        <Text>没有更多数据了</Text>
                    </View>
                )
                break
            case MomentFlatList.FOOTER_STATE_ERROR:
                footer = (
                    <View style={{ backgroundColor: "#ffffff", flexBasis: "auto", flexShrink: 0, flexGrow: 0, flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: 10, paddingBottom: 10 }}>
                        <Button onPress={this.loadMoreRetry} title="点我重试" />
                    </View>
                )
                break
        }
        return footer;
    }

    keyExtractor = (item, index) => item.id

    onEndReached = () => {
        if (this.state.footerState == MomentFlatList.FOOTER_STATE_LOADING_MORE) {
            this.requestData(this.pageNum)
        }
    }

    hideLodaing = () => {
        this.setState((prev, props) => Object.assign(prev, { showLoading: false }))
    }

    errorRetry = () => {
        this.pageNum = 0;
        this.setState((prev, props) => Object.assign(prev, {
            showError: false,
            showLoading: true,
            refreshing: false,
            footerState: MomentFlatList.FOOTER_STATE_NONE
        }))
        this.requestData(this.pageNum)
    }

    loadMoreRetry = () => {
        this.setState((prev, props) => Object.assign(prev, {
            showError: false,
            showLoading: false,
            refreshing: false,
            footerState: MomentFlatList.FOOTER_STATE_LOADING_MORE
        }))
    }


    render() {
        return (
            <View style={{ flex: 1, width: "100%" }}>
                <FlatList
                    style={{ flex: 1, width: "100%" }}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={1}
                    onRefresh={this.pullRefresh}
                    refreshing={this.state.refreshing}
                    ListFooterComponent={this.renderFooter}
                />

                {this.state.showLoading &&
                    <View style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator
                            animating={true}
                            color='#f93684'
                            size="large"
                        />
                    </View>
                }
                {this.state.showError &&
                    <View style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center" }}>
                        <Button onPress={this.errorRetry} title="点我重试" />
                    </View>
                }
            </View>
        );
    }
}