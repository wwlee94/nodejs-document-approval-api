var Express = require('express');
var User = require('../models/user');
var Util = require('../utils/util');
var Exception = require('../exceptions/exception');

var Users = Express.Router();

Users.get('/', Util.isLoggedin, findUserByEmail);
Users.post('/', createUser);
Users.delete('/', Util.isLoggedin, checkPermission, deleteUserByEmail);

module.exports = Users;

// 이메일로 유저 조회
function findUserByEmail(req, res, next){
    if (!req.query.email) return next(new Exception.NotFoundParameterError('이메일을 입력해주세요 !'));
    User.findOne({ email: req.query.email })
        .then(user => {
            response = user ? user : '검색된 데이터가 없습니다.';
            res.send(Util.responseMsg(response));
        })
        .catch(err => { return next(new Exception.ExceptionError(err.message)); 
    });
}

// 유저 생성
function createUser(req, res, next){
    var user = new User(req.body);
    user.save()
        .then(user => {
            res.send(Util.responseMsg(`${user.email} 계정을 생성했습니다 !`));
        })
        .catch(err => { return next(new Exception.ExceptionError(err.message)); 
    });
}

// 삭제 권한 확인
function checkPermission(req, res, next){
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) return next(new Exception.NotFoundDataError(`'${req.body.email}' 사용자를 찾을 수 없습니다.`));
            else if (!req.user || user._id != req.user._id) return next(new Exception.Forbidden('유저를 삭제할 권한이 없습니다.'));
            else next();
        })
        .catch(err => { return next(new Exception.ExceptionError(err.message));
    });
}

// 유저 삭제
function deleteUserByEmail(req, res, next){
    User.findOneAndRemove({ email: req.body.email })
        .then(user => {
            response = user ? { 'user': user.email, 'message': '회원 탈퇴 되었습니다 !'} : '검색된 데이터가 없습니다.';
            res.send(Util.responseMsg(response));
        })
        .catch(err => { return next(new Exception.ExceptionError(err.message));
    });
}