import Vue from 'vue'

export default {
    isSmaller(version1, version2){
        var version1 = version1.split('.').map(Number);
        var version2 = version2.split('.').map(Number);

        if(version1[0] < version2[0]) return true;
        if(version1[0] == version2[0] && version1[1] < version2[1]) return true;
        if(version1[0] == version2[0] && version1[1] == version2[1] && version1[2] < version2[2]) return true;
        return false;
    }
}